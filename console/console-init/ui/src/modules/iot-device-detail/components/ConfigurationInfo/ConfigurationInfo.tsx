/*
 * Copyright 2020, EnMasse authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import React, { useState, useEffect } from "react";
import {
  Page,
  PageSection,
  Grid,
  GridItem,
  Card,
  CardBody,
  Title,
  DropdownPosition,
  Tooltip,
  TooltipPosition,
  Button,
  ButtonVariant
} from "@patternfly/react-core";
import { FilterIcon, ExclamationCircleIcon } from "@patternfly/react-icons";
import { StyleSheet, css } from "aphrodite";
import { DropdownWithToggle, IDropdownOption } from "components";
import {
  CredentialsView,
  ICredentialsViewProps
} from "modules/iot-device-detail/components";
import {
  credentialsTypeOptions,
  getDefaultCredentialsFiterOption
} from "modules/iot-device-detail/utils";
import { CredentialsType } from "constant";
import { AdapterListContainer } from "containers";

const style = StyleSheet.create({
  filter_dropdown: {
    paddingLeft: 20
  }
});

export interface IConfigurationInfoProps
  extends Pick<ICredentialsViewProps, "credentials"> {
  id: string;
  onSelectFilterType?: (value: string) => void;
  onSelectFilterValue?: (value: string) => void;
}

export const ConfigurationInfo: React.FC<IConfigurationInfoProps> = ({
  id,
  credentials,
  onSelectFilterType,
  onSelectFilterValue
}) => {
  const [credentialType, setCredentialType] = useState<string>("enabled");
  const [filterOptions, setFilterOptions] = useState<IDropdownOption[]>([]);
  const [selectedFilterValue, setSelectedFilterValue] = useState<string>("");

  useEffect(() => {
    getFilterOptions();
  }, [credentialType, credentials]);

  const onSelectCredentialType = (value: string) => {
    setCredentialType(value);
    /**
     * reset default selected value of filter dropdown
     */
    onSelectFilterValue && onSelectFilterValue("all");
    onSelectFilterType && onSelectFilterType(value);
  };

  const onSelectFilterItem = (value: string) => {
    setSelectedFilterValue(value);
    onSelectFilterValue && onSelectFilterValue(value);
  };

  const shouldDisplayChildDropdown = () => {
    if (
      credentialType === CredentialsType.PASSWORD ||
      credentialType === CredentialsType.PSK ||
      credentialType === CredentialsType.X509_CERTIFICATE
    ) {
      return true;
    }
    return false;
  };

  const getFilterOptions = () => {
    const filterOptions = getDefaultCredentialsFiterOption(credentialType);
    const defaultSelectedOption = shouldDisplayChildDropdown()
      ? filterOptions[0]?.value
      : "";
    if (shouldDisplayChildDropdown() && credentials) {
      const newCredentials = [...credentials];
      newCredentials
        ?.filter((item: any) => item?.type === credentialType)
        .forEach((item: any) => {
          const { "auth-id": authId } = item;
          filterOptions.push({
            key: authId,
            value: authId,
            label: `Auth ID: ${authId}`
          });
        });
    }
    setSelectedFilterValue(defaultSelectedOption);
    setFilterOptions(shouldDisplayChildDropdown() ? filterOptions : []);
  };

  return (
    <>
      <Tooltip
        id="config-info-help-tooltip"
        position={TooltipPosition.bottom}
        enableFlip={false}
        content={
          <>
            This info section provides a quick view of the information needed to
            configure a device connection on the device side.
          </>
        }
      >
        <Button
          id="config-info-help-icon-button"
          icon={<ExclamationCircleIcon />}
          variant={ButtonVariant.link}
        >
          What is the device configuration info for?
        </Button>
      </Tooltip>
      <Page id={id}>
        <PageSection>
          <Grid hasGutter>
            <GridItem span={6}>
              <Card>
                <CardBody>
                  <Title size="2xl" headingLevel="h1">
                    Adapters
                  </Title>
                  <br />
                  <AdapterListContainer id="config-info-adapter-container" />
                </CardBody>
              </Card>
            </GridItem>
            <GridItem span={6}>
              <Grid hasGutter>
                <GridItem>
                  <Card>
                    <CardBody>
                      <DropdownWithToggle
                        id="config-info-credential-type-dropdown"
                        toggleId={"ci-credential-type-dropdown"}
                        position={DropdownPosition.left}
                        onSelectItem={onSelectCredentialType}
                        dropdownItems={credentialsTypeOptions}
                        value={credentialType && credentialType.trim()}
                        isLabelAndValueNotSame={true}
                        toggleIcon={
                          <>
                            <FilterIcon />
                            &nbsp;
                          </>
                        }
                      />
                      {filterOptions?.length > 0 && (
                        <DropdownWithToggle
                          id="config-info-filter-dropdown"
                          toggleId={"ci-filter-dropdown"}
                          position={DropdownPosition.left}
                          onSelectItem={onSelectFilterItem}
                          dropdownItems={filterOptions}
                          value={selectedFilterValue}
                          isLabelAndValueNotSame={true}
                          className={css(style.filter_dropdown)}
                        />
                      )}
                    </CardBody>
                  </Card>
                </GridItem>
              </Grid>
              <CredentialsView
                id="config-info-credentials-view"
                credentials={credentials}
              />
            </GridItem>
          </Grid>
        </PageSection>
      </Page>
    </>
  );
};
