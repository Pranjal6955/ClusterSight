package interfaces

// Define service interfaces that handlers can depend on
type ClusterService interface {
    // Add your service method signatures here
    GetClusters() ([]interface{}, error)
    CreateCluster(data interface{}) error
    // ... other methods
}

type NodeService interface {
    // Add your node service method signatures here
    GetNodes() ([]interface{}, error)
    // ... other methods
}
