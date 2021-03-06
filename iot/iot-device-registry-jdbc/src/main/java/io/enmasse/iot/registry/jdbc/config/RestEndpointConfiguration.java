/*
 * Copyright 2019, EnMasse authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

package io.enmasse.iot.registry.jdbc.config;

import java.time.Duration;
import java.time.temporal.ChronoUnit;

import org.eclipse.hono.config.ServiceConfigProperties;
import org.eclipse.hono.deviceregistry.server.DeviceRegistryHttpServer;
import org.eclipse.hono.util.Constants;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.convert.DurationUnit;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import static io.enmasse.iot.registry.jdbc.Profiles.PROFILE_REGISTRY_MANAGEMENT;
import io.enmasse.iot.utils.ConfigBase;

@Configuration
public class RestEndpointConfiguration {

    /**
     * Defines expiration lifespan for caching authentication tokens in seconds.
     * Default value of 0 means that caching is disabled
     */
    @DurationUnit(ChronoUnit.SECONDS)
    private Duration authTokenCacheExpiration = Duration.ofSeconds(60);

    /**
     * Gets properties for configuring the Device Registry's REST endpoint.
     *
     * @return The properties.
     */
    @Bean
    @ConfigurationProperties(ConfigBase.CONFIG_BASE + ".rest")
    @Qualifier(Constants.QUALIFIER_REST)
    public ServiceConfigProperties restProperties() {
        return new ServiceConfigProperties();
    }

    public Duration getAuthTokenCacheExpiration() {
        return authTokenCacheExpiration;
    }

    public void setAuthTokenCacheExpiration(Duration authTokenCacheExpiration) {
        this.authTokenCacheExpiration = authTokenCacheExpiration;
    }

    /**
     * Creates a new server for exposing the device registry's AMQP 1.0 based
     * endpoints.
     *
     * @return The server.
     */
    @Bean
    @Profile(PROFILE_REGISTRY_MANAGEMENT)
    public DeviceRegistryHttpServer httpServer() {
        return new DeviceRegistryHttpServer();
    }
}
