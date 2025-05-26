package services

import (
	"context"
	"strconv"
	"strings"

	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"

	"clustersight-backend/internal/models"
)

type DockerService struct {
	client *client.Client
}

func NewDockerService() *DockerService {
	cli, err := client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	if err != nil {
		panic(err)
	}

	return &DockerService{
		client: cli,
	}
}

func (d *DockerService) ListContainers() ([]models.ContainerInfo, error) {
	containers, err := d.client.ContainerList(context.Background(), container.ListOptions{
		All: true, // Include stopped containers
	})
	if err != nil {
		return nil, err
	}

	var containerInfos []models.ContainerInfo

	for _, container := range containers {
		// Extract container name (remove leading slash)
		name := ""
		if len(container.Names) > 0 {
			name = strings.TrimPrefix(container.Names[0], "/")
		}

		// Map port bindings
		var ports []models.PortMapping
		for _, port := range container.Ports {
			portMapping := models.PortMapping{
				PrivatePort: int(port.PrivatePort),
				Type:        port.Type,
			}
			
			if port.PublicPort != 0 {
				portMapping.PublicPort = int(port.PublicPort)
				portMapping.IP = port.IP
			}
			
			ports = append(ports, portMapping)
		}

		containerInfo := models.ContainerInfo{
			ID:      container.ID[:12], // Short ID
			Name:    name,
			Image:   container.Image,
			Status:  container.Status,
			State:   container.State,
			Ports:   ports,
			Labels:  container.Labels,
			Created: container.Created,
		}

		containerInfos = append(containerInfos, containerInfo)
	}

	return containerInfos, nil
}

func (d *DockerService) GetContainer(containerID string) (*models.ContainerInfo, error) {
	container, err := d.client.ContainerInspect(context.Background(), containerID)
	if err != nil {
		return nil, err
	}

	// Extract container name
	name := strings.TrimPrefix(container.Name, "/")

	// Map port bindings from inspect result
	var ports []models.PortMapping
	if container.NetworkSettings != nil && container.NetworkSettings.Ports != nil {
		for portProto, bindings := range container.NetworkSettings.Ports {
			for _, binding := range bindings {
				portMapping := models.PortMapping{
					Type: strings.Split(string(portProto), "/")[1],
				}
				
				if binding.HostPort != "" {
					if publicPort := parsePort(binding.HostPort); publicPort > 0 {
						portMapping.PublicPort = publicPort
						portMapping.IP = binding.HostIP
					}
				}
				
				ports = append(ports, portMapping)
			}
		}
	}

	containerInfo := &models.ContainerInfo{
		ID:      container.ID[:12],
		Name:    name,
		Image:   container.Config.Image,
		Status:  container.State.Status,
		State:   container.State.Status,
		Ports:   ports,
		Labels:  container.Config.Labels,
		Created: 0, // container.Created is a string in inspect, use 0 for now
	}

	return containerInfo, nil
}

func parsePort(portStr string) int {
	port, err := strconv.Atoi(portStr)
	if err != nil {
		return 0
	}
	return port
}
