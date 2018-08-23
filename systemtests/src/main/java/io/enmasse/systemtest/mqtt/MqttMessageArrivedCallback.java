/*
 * Copyright 2016-2018, EnMasse authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
package io.enmasse.systemtest.mqtt;

import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttCallback;

public interface MqttMessageArrivedCallback extends MqttCallback {
    @Override
    default void connectionLost(Throwable cause) {
    }

    @Override
    default void deliveryComplete(IMqttDeliveryToken token) {
    }

}
