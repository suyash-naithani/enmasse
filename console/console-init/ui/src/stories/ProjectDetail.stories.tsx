/*
 * Copyright 2020, EnMasse authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import React from "react";
import { select, text, number } from "@storybook/addon-knobs";
import { MemoryRouter } from "react-router";
import {
  ProjectNavigation,
  GeneralInfo,
  IInfoTypePlan
} from "modules/project-detail/components";
import { Page, Grid, GridItem } from "@patternfly/react-core";
import {
  DeviceRegistationManagement,
  IAdapter,
  IAdapterConfig,
  AccessCredentials
} from "modules/project-detail/components";

export default {
  title: "Project Detail"
};

export const projectDetailHeaderNavigation = () => {
  const options = ["detail", "devices", "certificates"];
  return (
    <MemoryRouter>
      <ProjectNavigation
        activeItem={select("Active Nav Item", options, "devices")}
      />
    </MemoryRouter>
  );
};

export const projectGeneralInfo = () => {
  const eventAddressName: IInfoTypePlan = {
    type: "qpid-jms:sender"
  };
  const telemetryAddressName: IInfoTypePlan = {
    type: "qpid-jms:sender"
  };
  const commandAddressName: IInfoTypePlan = {
    type: "qpid-jms:sender",
    plan: "Reciever-156458"
  };

  return (
    <MemoryRouter>
      <Page>
        <Grid>
          <GridItem span={6}>
            <GeneralInfo
              addressSpace={text("addressSpace", "devops_iot")}
              eventAddressName={eventAddressName}
              telemetryAddressName={telemetryAddressName}
              commandAddressName={commandAddressName}
              maxConnection={number("Max connections", 50000)}
              dataVolume={number("Data volume", 50000)}
              startDate={text("Start Date", "start Date")}
              endDate={text("End Date", "end Date")}
            />
          </GridItem>
        </Grid>
      </Page>
    </MemoryRouter>
  );
};
export const projectDetailRegistryManagement = () => {
  const registrationApi: IAdapterConfig = {
    url: "https://http.bosch-iot-hub.com",
    host: "mange.bosh-iot-hub.com",
    port: 5647
  };
  const credentialApi: IAdapterConfig = {
    url: "https://http.bosch-iot-hub.com",
    host: "mange.bosh-iot-hub.com",
    port: 268
  };
  return (
    <MemoryRouter>
      <Page>
        <Grid>
          <GridItem span={6}>
            <DeviceRegistationManagement
              username={text("username", "username")}
              password={text("password", "password")}
              registrationApi={registrationApi}
              credentialApi={credentialApi}
            />
          </GridItem>
        </Grid>
      </Page>
    </MemoryRouter>
  );
};

export const projectAccessCredentials = () => {
  const eventAddressName: IInfoTypePlan = {
    type: text("Event Address Name Type", "qpid-jms:sender")
  };
  const telemetryAddressName: IInfoTypePlan = {
    type: text("Telemetry Address Name Type", "qpid-jms:sender")
  };
  const commandAddressName: IInfoTypePlan = {
    type: text("Command Address Name Type", "qpid-jms:sender"),
    plan: text("Command Address Name Plan", "Reciever-156458")
  };

  const messaging = {
    url: "https://http.bosch-iot-hub.com",
    username: text("username", "username"),
    password: text("password", "password"),
    addressSpace: text("Address space", "devops-iottest"),
    eventsAddressNam: eventAddressName,
    telemetryAddressName: telemetryAddressName,
    commandAddressName: commandAddressName
  };
  const httpAdapter: IAdapterConfig = {
    url: "https://http.bosch-iot-hub.com"
  };
  const mqttAdapter: IAdapterConfig = {
    tlsEnabled: true,
    host: "mange.bosh-iot-hub.com",
    port: 8883
  };
  const amqpAdapter: IAdapterConfig = {
    url: "https://http.bosch-iot-hub.com"
  };
  const coapAdapter: IAdapterConfig = {
    url: "https://http.bosch-iot-hub.com"
  };
  const adapters: IAdapter[] = [
    { type: "http", value: httpAdapter },
    { type: "mqtt", value: mqttAdapter },
    { type: "amqp", value: amqpAdapter },
    { type: "coap", value: coapAdapter }
  ];

  return (
    <MemoryRouter>
      <Page>
        <Grid>
          <GridItem span={6}>
            <AccessCredentials
              tenantId={text("Tenenant Id", "FNDSKB5GSD58EGWAW6663RWfsaf8")}
              messaging={messaging}
              adapters={adapters}
            />
          </GridItem>
        </Grid>
      </Page>
    </MemoryRouter>
  );
};