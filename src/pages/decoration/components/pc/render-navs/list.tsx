import React, { useState, useEffect } from "react";
import { Table } from "antd";
import { system } from "../../../../../api";
import type { ColumnsType } from "antd/es/table";

interface DataType {
  id: React.Key;
  charge: number;
}

interface PropInterface {
  open: boolean;
  
}
