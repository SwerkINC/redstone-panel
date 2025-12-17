/**
 * Represents the health log entry of a Docker container.
 */
export interface DockerHealthLogEntry {
    Start: string;
    End: string;
    ExitCode: number;
    Output: string;
}

/**
 * Describes the health status of a Docker container.
 */
export interface DockerHealth {
    Status: 'starting' | 'healthy' | 'unhealthy' | 'none';
    FailingStreak: number;
    Log: DockerHealthLogEntry[];
}

/**
 * Represents the state of a Docker container.
 */
export interface DockerContainerState {
    Status: string;
    Running: boolean;
    Paused: boolean;
    Restarting: boolean;
    OOMKilled: boolean;
    Dead: boolean;
    Pid: number;
    ExitCode: number;
    Error: string;
    StartedAt: string;
    FinishedAt: string;
    Health?: DockerHealth;
}

/**
 * Information about a volume mount for a Docker container.
 */
export interface DockerMount {
    Type: string;
    Name?: string;
    Source: string;
    Destination: string;
    Driver?: string;
    Mode: string;
    RW: boolean;
    Propagation: string;
}

/**
 * The host configuration for a Docker container.
 */
export interface DockerHostConfig {
    Binds?: string[];
    ContainerIDFile?: string;
    LogConfig: {
        Type: string;
        Config: Record<string, string>;
    };
    NetworkMode: string;
    PortBindings?: Record<
        string,
        Array<{
            HostIp: string;
            HostPort: string;
        }>
    >;
    RestartPolicy: {
        Name: string;
        MaximumRetryCount: number;
    };
    AutoRemove: boolean;
    [key: string]: unknown;
}

/**
 * Information about the settings of a Docker container's network.
 */
export interface DockerNetwork {
    IPAMConfig: unknown | null;
    Links: string[] | null;
    Aliases: string[] | null;
    DriverOpts: Record<string, string> | null;
    GwPriority: number;
    NetworkID: string;
    EndpointID: string;
    Gateway: string;
    IPAddress: string;
    MacAddress: string;
    IPPrefixLen: number;
    IPv6Gateway: string;
    GlobalIPv6Address: string;
    GlobalIPv6PrefixLen: number;
    DNSNames: string[] | null;
}

/**
 * Docker container network settings as returned by `docker inspect`.
 */
export interface DockerNetworkSettings {
    SandboxID: string;
    SandboxKey: string;
    Ports: Record<
        string,
        Array<{
            HostIp: string;
            HostPort: string;
        }>
    >;
    Networks: Record<string, DockerNetwork>;
}

/**
 * Healthcheck configuration for a Docker container.
 */
export interface DockerHealthcheck {
    Test: string[];
    Interval: number;
    StartPeriod: number;
    Retries: number;
}

/**
 * Labels for Docker images and containers.
 */
export interface DockerLabels {
    [key: string]: string;
}

/**
 * Docker container config as returned by `docker inspect`.
 */
export interface DockerConfig {
    Hostname: string;
    Domainname: string;
    User: string;
    AttachStdin: boolean;
    AttachStdout: boolean;
    AttachStderr: boolean;
    ExposedPorts: Record<string, unknown>;
    Tty: boolean;
    OpenStdin: boolean;
    StdinOnce: boolean;
    Env: string[];
    Cmd: string[] | null;
    Healthcheck?: DockerHealthcheck;
    Image: string;
    Volumes: Record<string, unknown>;
    WorkingDir: string;
    Entrypoint?: string[];
    Labels: DockerLabels;
    StopSignal?: string;
    StopTimeout?: number;
}

/**
 * Describes the structure returned by `docker inspect` for a container.
 */
export interface DockerContainerInfo {
    Id: string;
    Created: string;
    Path: string;
    Args: string[];
    State: DockerContainerState;
    Image: string;
    ResolvConfPath: string;
    HostnamePath: string;
    HostsPath: string;
    LogPath: string;
    Name: string;
    RestartCount: number;
    Driver: string;
    Platform: string;
    MountLabel: string;
    ProcessLabel: string;
    AppArmorProfile: string;
    ExecIDs: string[] | null;
    HostConfig: DockerHostConfig;
    GraphDriver: {
        Name: string;
        Data: Record<string, unknown> | null;
    };
    Mounts: DockerMount[];
    Config: DockerConfig;
    NetworkSettings: DockerNetworkSettings;
    ImageManifestDescriptor?: {
        mediaType: string;
        digest: string;
        size: number;
        platform: {
            architecture: string;
            os: string;
        };
    };
}
/**
 * The type returned from Docker inspect command as an array of container info.
 */
export type DockerInspectOutput = DockerContainerInfo[];
