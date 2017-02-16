/*
 * Copyright 2016 Red Hat Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package enmasse.mqtt;

import enmasse.mqtt.endpoints.AmqpLwtEndpoint;
import enmasse.mqtt.storage.LwtStorage;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.proton.ProtonClient;
import io.vertx.proton.ProtonConnection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Vert.x based MQTT Last Will and Testament service for EnMasse
 */
@Component
public class MqttLwt extends AbstractVerticle {

    private static final Logger LOG = LoggerFactory.getLogger(MqttLwt.class);

    private static final String CONTAINER_ID = "lwt-service";

    // connection info to the messaging service
    private String messagingServiceHost;
    private int messagingServiceInternalPort;

    private ProtonClient client;

    private AmqpLwtEndpoint lwtEndpoint;
    private LwtStorage lwtStorage;

    @Override
    public void start(Future<Void> startFuture) throws Exception {

        LOG.info("Starting MQTT LWT service verticle...");
        this.connect(startFuture);
    }

    @Override
    public void stop(Future<Void> stopFuture) throws Exception {

        this.lwtEndpoint.close();
        this.lwtStorage.close();
        LOG.info("Stopping MQTT LWT service verticle...");
        stopFuture.complete();
    }

    /**
     * Connect to the AMQP messaging network
     *
     * @param startFuture
     */
    private void connect(Future<Void> startFuture) {

        this.client = ProtonClient.create(this.vertx);

        Future<ProtonConnection> lwtConnFuture = Future.future();

        // connecting to the messaging service (router network)
        this.client.connect(this.messagingServiceHost, this.messagingServiceInternalPort, done -> {

            if (done.succeeded()) {

                LOG.info("MQTT LWT service connected to the messaging service ...");

                ProtonConnection connection = done.result();
                connection.setContainer(CONTAINER_ID);

                // TODO
                this.lwtEndpoint = new AmqpLwtEndpoint(connection);
                this.lwtEndpoint.open();

                lwtConnFuture.complete();

            } else {

                LOG.error("Error connecting MQTT LWT service to the messaging service ...", done.cause());

                lwtConnFuture.fail(done.cause());
            }

        });

        // compose the connection to the messaging service with connection to storage service
        lwtConnFuture.compose(v -> {

            // connecting to the storage service
            this.lwtStorage.open(done -> {

                if (done.succeeded()) {

                    LOG.info("MQTT LWT service connected to the storage service ...");

                    // TODO

                    startFuture.complete();

                } else {

                    LOG.error("Error connecting MQTT LWT service to the storage service ...", done.cause());

                    startFuture.fail(done.cause());
                }

            });

        }, startFuture);
    }

    /**
     * Set the address for connecting to the AMQP internal network
     *
     * @param messagingServiceHost   address for AMQP connection
     * @return  current MQTT LWT instance
     */
    @Value(value = "${messaging.service.host:localhost}")
    public MqttLwt setMessagingServiceHost(String messagingServiceHost) {
        this.messagingServiceHost = messagingServiceHost;
        return this;
    }

    /**
     * Set the port for connecting to the AMQP internal network
     *
     * @param messagingServiceInternalPort   port for AMQP connection
     * @return  current MQTT LWT instance
     */
    @Value(value = "${messaging.service.internal.port:55673}")
    public MqttLwt setMessagingServiceInternalPort(int messagingServiceInternalPort) {
        this.messagingServiceInternalPort = messagingServiceInternalPort;
        return this;
    }

    /**
     * Set the LWT Storage service implementation to use
     *
     * @param lwtStorage    LWT Storage service instance
     * @return  current MQTT LWT instance
     */
    @Autowired
    public MqttLwt setLwtStorage(LwtStorage lwtStorage) {
        this.lwtStorage = lwtStorage;
        return this;
    }
}
