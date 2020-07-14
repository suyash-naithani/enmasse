/*
 * Copyright 2020, EnMasse authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import React from "react";
import { Link } from "react-router-dom";
import {
  Table,
  TableVariant,
  TableHeader,
  TableBody,
  IRowData,
  sortable,
  ISortBy,
  IExtraData
} from "@patternfly/react-table";
import { FormatDistance } from "use-patternfly";
import { StyleSheet, css } from "aphrodite";
import { ConnectionProtocolFormat } from "utils";
import { useWindowDimensions } from "components";

const StyleForTable = StyleSheet.create({
  scroll_overflow: {
    overflowY: "auto",
    paddingBottom: 100
  }
});

interface IConnectionListProps {
  rows: IConnection[];
  addressSpaceType?: string;
  sortBy?: ISortBy;
  onSort?: (_event: any, index: number, direction: string) => void;
  onCloseConnection: (data: IConnection) => void;
  onSelectConnection: (connection: IConnection, isSelected: boolean) => void;
  onSelectAllConnection: (
    connections: IConnection[],
    isSelected: boolean
  ) => void;
}
export enum ConnectionStatus {
  CREATING = "creating",
  DELETING = "deleting",
  RUNNING = "running"
}
export interface IConnection {
  hostname: string;
  containerId: string;
  protocol: string;
  encrypted: boolean;
  messageIn: number | string;
  messageOut: number | string;
  senders: number | string;
  receivers: number | string;
  status: ConnectionStatus;
  name: string;
  creationTimestamp: string;
  selected?: boolean;
}

export const ConnectionList: React.FunctionComponent<IConnectionListProps> = ({
  rows,
  addressSpaceType,
  sortBy,
  onSort,
  onCloseConnection,
  onSelectConnection,
  onSelectAllConnection
}) => {
  const { width } = useWindowDimensions();

  const toTableCells = (connection: IConnection) => {
    const {
      selected,
      name,
      hostname,
      containerId,
      protocol,
      encrypted,
      creationTimestamp,
      messageIn,
      messageOut,
      senders,
      receivers
    } = connection || {};
    const tableRow: IRowData = {
      selected: selected,
      cells: [
        {
          title: (
            <Link id="connect-list-hostname-title" to={`connections/${name}`}>
              {hostname}
            </Link>
          )
        },
        containerId,
        {
          title: (
            <ConnectionProtocolFormat
              protocol={protocol}
              encrypted={encrypted}
            />
          )
        },
        {
          title: (
            <>
              <FormatDistance date={creationTimestamp} /> ago
            </>
          )
        },
        messageIn,
        !addressSpaceType || addressSpaceType === "brokered" ? "" : messageOut,
        senders,
        receivers
      ],
      originalData: connection
    };
    return tableRow;
  };

  const tableRows = rows && rows.map(toTableCells);

  const tableColumns = [
    { title: "Hostname", transforms: [sortable] },
    { title: "Container ID", transforms: [sortable] },
    { title: "Protocol", transforms: [sortable] },
    { title: "Time created", transforms: [sortable] },
    {
      title:
        width > 769 ? (
          <span style={{ display: "inline-flex" }}>
            Message In/sec
            <br />
            {`(over last 5 min)`}
          </span>
        ) : (
          "Message In/sec"
        ),
      transforms: [sortable],
      dataLabel: "Message In"
    },
    !addressSpaceType || addressSpaceType === "brokered"
      ? ""
      : {
          title:
            width > 769 ? (
              <span style={{ display: "inline-flex" }}>
                Message Out/sec
                <br />
                {`(over last 5 min)`}
              </span>
            ) : (
              "Message Out/sec"
            ),
          transforms: [sortable],
          dataLabel: "Message Out"
        },
    {
      title: "Senders",
      transforms: [sortable]
    },
    {
      title: "Receivers",
      transforms: [sortable]
    }
  ];
  const actionResolver = (rowData: IRowData) => {
    const originalData = rowData.originalData as IConnection;
    return [
      {
        id: "close-connection",
        title: "Close",
        onClick: () => onCloseConnection(originalData)
      }
    ];
  };

  const onSelect = (
    event: React.FormEvent<HTMLInputElement>,
    isSelected: boolean,
    rowIndex: number,
    rowData: IRowData,
    extraData: IExtraData
  ) => {
    let rows;
    if (rowIndex === -1) {
      rows = tableRows.map(row => {
        const rowCopy = row;
        rowCopy.selected = isSelected;
        return rowCopy;
      });
      onSelectAllConnection(
        rows.map(row => row.originalData),
        isSelected
      );
    } else {
      rows = [...tableRows];
      rows[rowIndex].selected = isSelected;
      onSelectConnection(rows[rowIndex].originalData, isSelected);
    }
  };

  return (
    <div id="connect-list-table" className={css(StyleForTable.scroll_overflow)}>
      <Table
        variant={TableVariant.compact}
        cells={tableColumns}
        rows={tableRows}
        actionResolver={actionResolver}
        aria-label="connection list"
        sortBy={sortBy}
        onSort={onSort}
        onSelect={onSelect}
      >
        <TableHeader id="connect-list-table-header" />
        <TableBody />
      </Table>
    </div>
  );
};
