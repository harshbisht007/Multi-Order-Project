import { gql } from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  ARRAY: { input: any; output: any; }
  Date: { input: any; output: any; }
  Datetime: { input: any; output: any; }
  ENUM: { input: any; output: any; }
  GEOM: { input: any; output: any; }
  JSON: { input: any; output: any; }
  List: { input: any; output: any; }
  Time: { input: any; output: any; }
  UUID: { input: any; output: any; }
};

export enum ActionType {
  AddOrderStatus = 'ADD_ORDER_STATUS',
  AssignRider = 'ASSIGN_RIDER',
  CancelOrder = 'CANCEL_ORDER',
  CreateOrder = 'CREATE_ORDER',
  SendOrderUpdate = 'SEND_ORDER_UPDATE',
  UnAssignRider = 'UN_ASSIGN_RIDER',
  UpdateOrder = 'UPDATE_ORDER',
  UpdateRider = 'UPDATE_RIDER'
}

export type Batch = {
  __typename?: 'Batch';
  category_id?: Maybe<Scalars['String']['output']>;
  category_name?: Maybe<Scalars['String']['output']>;
  company_id: Scalars['String']['output'];
  created_on: Scalars['Datetime']['output'];
  distance?: Maybe<Scalars['Int']['output']>;
  duration?: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  order?: Maybe<Order>;
  order_id?: Maybe<Scalars['Int']['output']>;
  rider_id?: Maybe<Scalars['UUID']['output']>;
  rider_name?: Maybe<Scalars['String']['output']>;
  rider_phone?: Maybe<Scalars['String']['output']>;
  sequence_id: Scalars['Int']['output'];
  touch_points: Array<BatchTouchPoint>;
  updated_on: Scalars['Datetime']['output'];
  volume?: Maybe<Scalars['Int']['output']>;
};


export type BatchCategory_IdArgs = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equal?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  notEqual?: InputMaybe<Scalars['String']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};


export type BatchCategory_NameArgs = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equal?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  notEqual?: InputMaybe<Scalars['String']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};


export type BatchCompany_IdArgs = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equal?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  notEqual?: InputMaybe<Scalars['String']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};


export type BatchCreated_OnArgs = {
  greaterEqual?: InputMaybe<Scalars['Datetime']['input']>;
  greaterThan?: InputMaybe<Scalars['Datetime']['input']>;
  lesserEqual?: InputMaybe<Scalars['Datetime']['input']>;
  lesserThan?: InputMaybe<Scalars['Datetime']['input']>;
};


export type BatchDistanceArgs = {
  equal?: InputMaybe<Scalars['Float']['input']>;
  greaterEqual?: InputMaybe<Scalars['Float']['input']>;
  greaterThan?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  lesserEqual?: InputMaybe<Scalars['Float']['input']>;
  lesserThan?: InputMaybe<Scalars['Float']['input']>;
  notEqual?: InputMaybe<Scalars['Float']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};


export type BatchDurationArgs = {
  equal?: InputMaybe<Scalars['Float']['input']>;
  greaterEqual?: InputMaybe<Scalars['Float']['input']>;
  greaterThan?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  lesserEqual?: InputMaybe<Scalars['Float']['input']>;
  lesserThan?: InputMaybe<Scalars['Float']['input']>;
  notEqual?: InputMaybe<Scalars['Float']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};


export type BatchIdArgs = {
  equal?: InputMaybe<Scalars['Float']['input']>;
  greaterEqual?: InputMaybe<Scalars['Float']['input']>;
  greaterThan?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  lesserEqual?: InputMaybe<Scalars['Float']['input']>;
  lesserThan?: InputMaybe<Scalars['Float']['input']>;
  notEqual?: InputMaybe<Scalars['Float']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};


export type BatchOrder_IdArgs = {
  equal?: InputMaybe<Scalars['Float']['input']>;
  greaterEqual?: InputMaybe<Scalars['Float']['input']>;
  greaterThan?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  lesserEqual?: InputMaybe<Scalars['Float']['input']>;
  lesserThan?: InputMaybe<Scalars['Float']['input']>;
  notEqual?: InputMaybe<Scalars['Float']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};


export type BatchRider_IdArgs = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equal?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  notEqual?: InputMaybe<Scalars['String']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};


export type BatchRider_NameArgs = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equal?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  notEqual?: InputMaybe<Scalars['String']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};


export type BatchRider_PhoneArgs = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equal?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  notEqual?: InputMaybe<Scalars['String']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};


export type BatchSequence_IdArgs = {
  equal?: InputMaybe<Scalars['Float']['input']>;
  greaterEqual?: InputMaybe<Scalars['Float']['input']>;
  greaterThan?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  lesserEqual?: InputMaybe<Scalars['Float']['input']>;
  lesserThan?: InputMaybe<Scalars['Float']['input']>;
  notEqual?: InputMaybe<Scalars['Float']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};


export type BatchUpdated_OnArgs = {
  greaterEqual?: InputMaybe<Scalars['Datetime']['input']>;
  greaterThan?: InputMaybe<Scalars['Datetime']['input']>;
  lesserEqual?: InputMaybe<Scalars['Datetime']['input']>;
  lesserThan?: InputMaybe<Scalars['Datetime']['input']>;
};


export type BatchVolumeArgs = {
  equal?: InputMaybe<Scalars['Float']['input']>;
  greaterEqual?: InputMaybe<Scalars['Float']['input']>;
  greaterThan?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  lesserEqual?: InputMaybe<Scalars['Float']['input']>;
  lesserThan?: InputMaybe<Scalars['Float']['input']>;
  notEqual?: InputMaybe<Scalars['Float']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};

export type BatchInput = {
  category_id?: InputMaybe<Scalars['String']['input']>;
  category_name?: InputMaybe<Scalars['String']['input']>;
  company_id?: InputMaybe<Scalars['String']['input']>;
  created_on?: InputMaybe<Scalars['Datetime']['input']>;
  distance?: InputMaybe<Scalars['Int']['input']>;
  duration?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<OrderInput>;
  order_id?: InputMaybe<Scalars['Int']['input']>;
  rider_id?: InputMaybe<Scalars['UUID']['input']>;
  rider_name?: InputMaybe<Scalars['String']['input']>;
  rider_phone?: InputMaybe<Scalars['String']['input']>;
  sequence_id?: InputMaybe<Scalars['Int']['input']>;
  touch_points?: InputMaybe<Array<InputMaybe<BatchTouchPointInput>>>;
  updated_on?: InputMaybe<Scalars['Datetime']['input']>;
  volume?: InputMaybe<Scalars['Int']['input']>;
};

export type BatchTouchPoint = {
  __typename?: 'BatchTouchPoint';
  batch?: Maybe<Batch>;
  batch_id?: Maybe<Scalars['Int']['output']>;
  company_id: Scalars['String']['output'];
  created_on: Scalars['Datetime']['output'];
  id: Scalars['Int']['output'];
  touch_point?: Maybe<TouchPoint>;
  touch_point_id?: Maybe<Scalars['Int']['output']>;
  updated_on: Scalars['Datetime']['output'];
};


export type BatchTouchPointBatch_IdArgs = {
  equal?: InputMaybe<Scalars['Float']['input']>;
  greaterEqual?: InputMaybe<Scalars['Float']['input']>;
  greaterThan?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  lesserEqual?: InputMaybe<Scalars['Float']['input']>;
  lesserThan?: InputMaybe<Scalars['Float']['input']>;
  notEqual?: InputMaybe<Scalars['Float']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};


export type BatchTouchPointCompany_IdArgs = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equal?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  notEqual?: InputMaybe<Scalars['String']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};


export type BatchTouchPointCreated_OnArgs = {
  greaterEqual?: InputMaybe<Scalars['Datetime']['input']>;
  greaterThan?: InputMaybe<Scalars['Datetime']['input']>;
  lesserEqual?: InputMaybe<Scalars['Datetime']['input']>;
  lesserThan?: InputMaybe<Scalars['Datetime']['input']>;
};


export type BatchTouchPointIdArgs = {
  equal?: InputMaybe<Scalars['Float']['input']>;
  greaterEqual?: InputMaybe<Scalars['Float']['input']>;
  greaterThan?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  lesserEqual?: InputMaybe<Scalars['Float']['input']>;
  lesserThan?: InputMaybe<Scalars['Float']['input']>;
  notEqual?: InputMaybe<Scalars['Float']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};


export type BatchTouchPointTouch_Point_IdArgs = {
  equal?: InputMaybe<Scalars['Float']['input']>;
  greaterEqual?: InputMaybe<Scalars['Float']['input']>;
  greaterThan?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  lesserEqual?: InputMaybe<Scalars['Float']['input']>;
  lesserThan?: InputMaybe<Scalars['Float']['input']>;
  notEqual?: InputMaybe<Scalars['Float']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};


export type BatchTouchPointUpdated_OnArgs = {
  greaterEqual?: InputMaybe<Scalars['Datetime']['input']>;
  greaterThan?: InputMaybe<Scalars['Datetime']['input']>;
  lesserEqual?: InputMaybe<Scalars['Datetime']['input']>;
  lesserThan?: InputMaybe<Scalars['Datetime']['input']>;
};

export type BatchTouchPointInput = {
  batch?: InputMaybe<BatchInput>;
  batch_id?: InputMaybe<Scalars['Int']['input']>;
  company_id?: InputMaybe<Scalars['String']['input']>;
  created_on?: InputMaybe<Scalars['Datetime']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  touch_point?: InputMaybe<TouchPointInput>;
  touch_point_id?: InputMaybe<Scalars['Int']['input']>;
  updated_on?: InputMaybe<Scalars['Datetime']['input']>;
};

export type Category = {
  __typename?: 'Category';
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
};

export type CustomTouchPointInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  category_type?: InputMaybe<Scalars['String']['input']>;
  closing_time?: InputMaybe<Scalars['String']['input']>;
  external_id?: InputMaybe<Scalars['String']['input']>;
  latitude?: InputMaybe<Scalars['Float']['input']>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
  opening_time?: InputMaybe<Scalars['String']['input']>;
  pincode?: InputMaybe<Scalars['String']['input']>;
  shipment_id?: InputMaybe<Scalars['String']['input']>;
  touch_point_type?: InputMaybe<Scalars['String']['input']>;
  weight?: InputMaybe<Scalars['Float']['input']>;
};

export type Geom = {
  __typename?: 'Geom';
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
};

export type GeomInput = {
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  create_batch: Batch;
  create_batch_touch_point: BatchTouchPoint;
  create_order: Order;
  create_route: Route;
  create_route_template: RouteTemplate;
  create_route_vehicle_config: RouteVehicleConfig;
  create_shipments: Scalars['Int']['output'];
  create_touch_point: TouchPoint;
  creates_batch: Array<Maybe<Batch>>;
  creates_batch_touch_point: Array<Maybe<BatchTouchPoint>>;
  creates_order: Array<Maybe<Order>>;
  creates_route: Array<Maybe<Route>>;
  creates_route_template: Array<Maybe<RouteTemplate>>;
  creates_route_vehicle_config: Array<Maybe<RouteVehicleConfig>>;
  creates_touch_point: Array<Maybe<TouchPoint>>;
  delete_batch: Batch;
  delete_batch_touch_point: BatchTouchPoint;
  delete_order: Order;
  delete_route: Route;
  delete_route_template: RouteTemplate;
  delete_route_vehicle_config: RouteVehicleConfig;
  delete_touch_point: TouchPoint;
  ping: Ping;
  run_routing: Scalars['UUID']['output'];
  update_batch: Batch;
  update_batch_touch_point: BatchTouchPoint;
  update_order: Order;
  update_route: Route;
  update_route_template: RouteTemplate;
  update_route_vehicle_config: RouteVehicleConfig;
  update_touch_point: TouchPoint;
  updates_batch: Array<Maybe<Batch>>;
  updates_batch_touch_point: Array<Maybe<BatchTouchPoint>>;
  updates_order: Array<Maybe<Order>>;
  updates_route: Array<Maybe<Route>>;
  updates_route_template: Array<Maybe<RouteTemplate>>;
  updates_route_vehicle_config: Array<Maybe<RouteVehicleConfig>>;
  updates_touch_point: Array<Maybe<TouchPoint>>;
};


export type MutationCreate_BatchArgs = {
  row: BatchInput;
};


export type MutationCreate_Batch_Touch_PointArgs = {
  row: BatchTouchPointInput;
};


export type MutationCreate_OrderArgs = {
  row: OrderInput;
};


export type MutationCreate_RouteArgs = {
  row: RouteInput;
};


export type MutationCreate_Route_TemplateArgs = {
  row: RouteTemplateInput;
};


export type MutationCreate_Route_Vehicle_ConfigArgs = {
  row: RouteVehicleConfigInput;
};


export type MutationCreate_ShipmentsArgs = {
  data: Array<CustomTouchPointInput>;
};


export type MutationCreate_Touch_PointArgs = {
  row: TouchPointInput;
};


export type MutationCreates_BatchArgs = {
  rows: Array<BatchInput>;
};


export type MutationCreates_Batch_Touch_PointArgs = {
  rows: Array<BatchTouchPointInput>;
};


export type MutationCreates_OrderArgs = {
  rows: Array<OrderInput>;
};


export type MutationCreates_RouteArgs = {
  rows: Array<RouteInput>;
};


export type MutationCreates_Route_TemplateArgs = {
  rows: Array<RouteTemplateInput>;
};


export type MutationCreates_Route_Vehicle_ConfigArgs = {
  rows: Array<RouteVehicleConfigInput>;
};


export type MutationCreates_Touch_PointArgs = {
  rows: Array<TouchPointInput>;
};


export type MutationDelete_BatchArgs = {
  id: Scalars['UUID']['input'];
};


export type MutationDelete_Batch_Touch_PointArgs = {
  id: Scalars['UUID']['input'];
};


export type MutationDelete_OrderArgs = {
  id: Scalars['UUID']['input'];
};


export type MutationDelete_RouteArgs = {
  id: Scalars['UUID']['input'];
};


export type MutationDelete_Route_TemplateArgs = {
  id: Scalars['UUID']['input'];
};


export type MutationDelete_Route_Vehicle_ConfigArgs = {
  id: Scalars['UUID']['input'];
};


export type MutationDelete_Touch_PointArgs = {
  id: Scalars['UUID']['input'];
};


export type MutationRun_RoutingArgs = {
  route_id: Scalars['Int']['input'];
};


export type MutationUpdate_BatchArgs = {
  change: BatchInput;
  id: Scalars['UUID']['input'];
};


export type MutationUpdate_Batch_Touch_PointArgs = {
  change: BatchTouchPointInput;
  id: Scalars['UUID']['input'];
};


export type MutationUpdate_OrderArgs = {
  change: OrderInput;
  id: Scalars['UUID']['input'];
};


export type MutationUpdate_RouteArgs = {
  change: RouteInput;
  id: Scalars['UUID']['input'];
};


export type MutationUpdate_Route_TemplateArgs = {
  change: RouteTemplateInput;
  id: Scalars['UUID']['input'];
};


export type MutationUpdate_Route_Vehicle_ConfigArgs = {
  change: RouteVehicleConfigInput;
  id: Scalars['UUID']['input'];
};


export type MutationUpdate_Touch_PointArgs = {
  change: TouchPointInput;
  id: Scalars['UUID']['input'];
};


export type MutationUpdates_BatchArgs = {
  rows: Array<BatchInput>;
};


export type MutationUpdates_Batch_Touch_PointArgs = {
  rows: Array<BatchTouchPointInput>;
};


export type MutationUpdates_OrderArgs = {
  rows: Array<OrderInput>;
};


export type MutationUpdates_RouteArgs = {
  rows: Array<RouteInput>;
};


export type MutationUpdates_Route_TemplateArgs = {
  rows: Array<RouteTemplateInput>;
};


export type MutationUpdates_Route_Vehicle_ConfigArgs = {
  rows: Array<RouteVehicleConfigInput>;
};


export type MutationUpdates_Touch_PointArgs = {
  rows: Array<TouchPointInput>;
};

export type Order = {
  __typename?: 'Order';
  batches: Array<Batch>;
  company_id: Scalars['String']['output'];
  created_on: Scalars['Datetime']['output'];
  id: Scalars['Int']['output'];
  route_id?: Maybe<Scalars['Int']['output']>;
  updated_on: Scalars['Datetime']['output'];
};


export type OrderCompany_IdArgs = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equal?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  notEqual?: InputMaybe<Scalars['String']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};


export type OrderCreated_OnArgs = {
  greaterEqual?: InputMaybe<Scalars['Datetime']['input']>;
  greaterThan?: InputMaybe<Scalars['Datetime']['input']>;
  lesserEqual?: InputMaybe<Scalars['Datetime']['input']>;
  lesserThan?: InputMaybe<Scalars['Datetime']['input']>;
};


export type OrderIdArgs = {
  equal?: InputMaybe<Scalars['Float']['input']>;
  greaterEqual?: InputMaybe<Scalars['Float']['input']>;
  greaterThan?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  lesserEqual?: InputMaybe<Scalars['Float']['input']>;
  lesserThan?: InputMaybe<Scalars['Float']['input']>;
  notEqual?: InputMaybe<Scalars['Float']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};


export type OrderRoute_IdArgs = {
  equal?: InputMaybe<Scalars['Float']['input']>;
  greaterEqual?: InputMaybe<Scalars['Float']['input']>;
  greaterThan?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  lesserEqual?: InputMaybe<Scalars['Float']['input']>;
  lesserThan?: InputMaybe<Scalars['Float']['input']>;
  notEqual?: InputMaybe<Scalars['Float']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};


export type OrderUpdated_OnArgs = {
  greaterEqual?: InputMaybe<Scalars['Datetime']['input']>;
  greaterThan?: InputMaybe<Scalars['Datetime']['input']>;
  lesserEqual?: InputMaybe<Scalars['Datetime']['input']>;
  lesserThan?: InputMaybe<Scalars['Datetime']['input']>;
};

export type OrderInput = {
  batches?: InputMaybe<Array<InputMaybe<BatchInput>>>;
  company_id?: InputMaybe<Scalars['String']['input']>;
  created_on?: InputMaybe<Scalars['Datetime']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  route_id?: InputMaybe<Scalars['Int']['input']>;
  updated_on?: InputMaybe<Scalars['Datetime']['input']>;
};

export enum OrderType {
  Drop = 'DROP',
  Pickup = 'PICKUP'
}

export type Ping = {
  __typename?: 'Ping';
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  get_batch: Batch;
  get_batch_touch_point: BatchTouchPoint;
  get_order: Order;
  get_route: Route;
  get_route_template: RouteTemplate;
  get_route_vehicle_config: RouteVehicleConfig;
  get_task_status: Task_Status_Response;
  get_tasks_statuses: Get_Tasks_Statuses_Response;
  get_touch_point: TouchPoint;
  list_batch: Array<Maybe<Batch>>;
  list_batch_touch_point: Array<Maybe<BatchTouchPoint>>;
  list_categories: Array<Category>;
  list_order: Array<Maybe<Order>>;
  list_route: Array<Maybe<Route>>;
  list_route_template: Array<Maybe<RouteTemplate>>;
  list_route_vehicle_config: Array<Maybe<RouteVehicleConfig>>;
  list_touch_point: Array<Maybe<TouchPoint>>;
  list_zones: Array<Zone>;
  login_user: TokenResponse;
  ping: Ping;
  user: UserResponse;
};


export type QueryGet_BatchArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryGet_Batch_Touch_PointArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryGet_OrderArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryGet_RouteArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryGet_Route_TemplateArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryGet_Route_Vehicle_ConfigArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryGet_Task_StatusArgs = {
  task_id: Scalars['String']['input'];
};


export type QueryGet_Tasks_StatusesArgs = {
  task_ids: Array<InputMaybe<Scalars['String']['input']>>;
};


export type QueryGet_Touch_PointArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryList_BatchArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryList_Batch_Touch_PointArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryList_OrderArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryList_RouteArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryList_Route_TemplateArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryList_Route_Vehicle_ConfigArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryList_Touch_PointArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryLogin_UserArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export type Route = {
  __typename?: 'Route';
  avg_speed?: Maybe<Scalars['Int']['output']>;
  company_id: Scalars['String']['output'];
  created_on: Scalars['Datetime']['output'];
  end_at_hub?: Maybe<Scalars['Boolean']['output']>;
  hub_location?: Maybe<Geom>;
  id: Scalars['Int']['output'];
  overwrite_duplicate?: Maybe<Scalars['Boolean']['output']>;
  riders?: Maybe<Scalars['Int']['output']>;
  sequence_id: Scalars['Int']['output'];
  single_batch?: Maybe<Scalars['Boolean']['output']>;
  start_from_hub?: Maybe<Scalars['Boolean']['output']>;
  start_time?: Maybe<Scalars['Time']['output']>;
  updated_on: Scalars['Datetime']['output'];
  vehicle_config: Array<RouteVehicleConfig>;
};


export type RouteAvg_SpeedArgs = {
  equal?: InputMaybe<Scalars['Float']['input']>;
  greaterEqual?: InputMaybe<Scalars['Float']['input']>;
  greaterThan?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  lesserEqual?: InputMaybe<Scalars['Float']['input']>;
  lesserThan?: InputMaybe<Scalars['Float']['input']>;
  notEqual?: InputMaybe<Scalars['Float']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};


export type RouteCompany_IdArgs = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equal?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  notEqual?: InputMaybe<Scalars['String']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};


export type RouteCreated_OnArgs = {
  greaterEqual?: InputMaybe<Scalars['Datetime']['input']>;
  greaterThan?: InputMaybe<Scalars['Datetime']['input']>;
  lesserEqual?: InputMaybe<Scalars['Datetime']['input']>;
  lesserThan?: InputMaybe<Scalars['Datetime']['input']>;
};


export type RouteEnd_At_HubArgs = {
  bool?: InputMaybe<Scalars['Boolean']['input']>;
};


export type RouteIdArgs = {
  equal?: InputMaybe<Scalars['Float']['input']>;
  greaterEqual?: InputMaybe<Scalars['Float']['input']>;
  greaterThan?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  lesserEqual?: InputMaybe<Scalars['Float']['input']>;
  lesserThan?: InputMaybe<Scalars['Float']['input']>;
  notEqual?: InputMaybe<Scalars['Float']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};


export type RouteOverwrite_DuplicateArgs = {
  bool?: InputMaybe<Scalars['Boolean']['input']>;
};


export type RouteRidersArgs = {
  equal?: InputMaybe<Scalars['Float']['input']>;
  greaterEqual?: InputMaybe<Scalars['Float']['input']>;
  greaterThan?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  lesserEqual?: InputMaybe<Scalars['Float']['input']>;
  lesserThan?: InputMaybe<Scalars['Float']['input']>;
  notEqual?: InputMaybe<Scalars['Float']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};


export type RouteSequence_IdArgs = {
  equal?: InputMaybe<Scalars['Float']['input']>;
  greaterEqual?: InputMaybe<Scalars['Float']['input']>;
  greaterThan?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  lesserEqual?: InputMaybe<Scalars['Float']['input']>;
  lesserThan?: InputMaybe<Scalars['Float']['input']>;
  notEqual?: InputMaybe<Scalars['Float']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};


export type RouteSingle_BatchArgs = {
  bool?: InputMaybe<Scalars['Boolean']['input']>;
};


export type RouteStart_From_HubArgs = {
  bool?: InputMaybe<Scalars['Boolean']['input']>;
};


export type RouteStart_TimeArgs = {
  greaterEqual?: InputMaybe<Scalars['Time']['input']>;
  greaterThan?: InputMaybe<Scalars['Time']['input']>;
  lesserEqual?: InputMaybe<Scalars['Time']['input']>;
  lesserThan?: InputMaybe<Scalars['Time']['input']>;
};


export type RouteUpdated_OnArgs = {
  greaterEqual?: InputMaybe<Scalars['Datetime']['input']>;
  greaterThan?: InputMaybe<Scalars['Datetime']['input']>;
  lesserEqual?: InputMaybe<Scalars['Datetime']['input']>;
  lesserThan?: InputMaybe<Scalars['Datetime']['input']>;
};

export type RouteInput = {
  avg_speed?: InputMaybe<Scalars['Int']['input']>;
  company_id?: InputMaybe<Scalars['String']['input']>;
  created_on?: InputMaybe<Scalars['Datetime']['input']>;
  end_at_hub?: InputMaybe<Scalars['Boolean']['input']>;
  hub_location?: InputMaybe<GeomInput>;
  id?: InputMaybe<Scalars['Int']['input']>;
  overwrite_duplicate?: InputMaybe<Scalars['Boolean']['input']>;
  riders?: InputMaybe<Scalars['Int']['input']>;
  sequence_id?: InputMaybe<Scalars['Int']['input']>;
  single_batch?: InputMaybe<Scalars['Boolean']['input']>;
  start_from_hub?: InputMaybe<Scalars['Boolean']['input']>;
  start_time?: InputMaybe<Scalars['Time']['input']>;
  updated_on?: InputMaybe<Scalars['Datetime']['input']>;
  vehicle_config?: InputMaybe<Array<InputMaybe<RouteVehicleConfigInput>>>;
};

export type RouteTemplate = {
  __typename?: 'RouteTemplate';
  auto_assign_riders?: Maybe<Scalars['Boolean']['output']>;
  avg_speed: Scalars['Int']['output'];
  company_id: Scalars['String']['output'];
  created_on: Scalars['Datetime']['output'];
  id: Scalars['Int']['output'];
  is_first_stop_hub?: Maybe<Scalars['Boolean']['output']>;
  is_last_stop_hub?: Maybe<Scalars['Boolean']['output']>;
  max_time_minute: Scalars['Int']['output'];
  max_travel_km: Scalars['Int']['output'];
  penalty: Scalars['Int']['output'];
  riders: Scalars['Int']['output'];
  start_time: Scalars['Datetime']['output'];
  updated_on: Scalars['Datetime']['output'];
  vehicle_capacity: Scalars['Int']['output'];
  waiting_time_per_vehicle: Scalars['Int']['output'];
};


export type RouteTemplateAuto_Assign_RidersArgs = {
  bool?: InputMaybe<Scalars['Boolean']['input']>;
};


export type RouteTemplateAvg_SpeedArgs = {
  equal?: InputMaybe<Scalars['Float']['input']>;
  greaterEqual?: InputMaybe<Scalars['Float']['input']>;
  greaterThan?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  lesserEqual?: InputMaybe<Scalars['Float']['input']>;
  lesserThan?: InputMaybe<Scalars['Float']['input']>;
  notEqual?: InputMaybe<Scalars['Float']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};


export type RouteTemplateCompany_IdArgs = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equal?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  notEqual?: InputMaybe<Scalars['String']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};


export type RouteTemplateCreated_OnArgs = {
  greaterEqual?: InputMaybe<Scalars['Datetime']['input']>;
  greaterThan?: InputMaybe<Scalars['Datetime']['input']>;
  lesserEqual?: InputMaybe<Scalars['Datetime']['input']>;
  lesserThan?: InputMaybe<Scalars['Datetime']['input']>;
};


export type RouteTemplateIdArgs = {
  equal?: InputMaybe<Scalars['Float']['input']>;
  greaterEqual?: InputMaybe<Scalars['Float']['input']>;
  greaterThan?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  lesserEqual?: InputMaybe<Scalars['Float']['input']>;
  lesserThan?: InputMaybe<Scalars['Float']['input']>;
  notEqual?: InputMaybe<Scalars['Float']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};


export type RouteTemplateIs_First_Stop_HubArgs = {
  bool?: InputMaybe<Scalars['Boolean']['input']>;
};


export type RouteTemplateIs_Last_Stop_HubArgs = {
  bool?: InputMaybe<Scalars['Boolean']['input']>;
};


export type RouteTemplateMax_Time_MinuteArgs = {
  equal?: InputMaybe<Scalars['Float']['input']>;
  greaterEqual?: InputMaybe<Scalars['Float']['input']>;
  greaterThan?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  lesserEqual?: InputMaybe<Scalars['Float']['input']>;
  lesserThan?: InputMaybe<Scalars['Float']['input']>;
  notEqual?: InputMaybe<Scalars['Float']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};


export type RouteTemplateMax_Travel_KmArgs = {
  equal?: InputMaybe<Scalars['Float']['input']>;
  greaterEqual?: InputMaybe<Scalars['Float']['input']>;
  greaterThan?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  lesserEqual?: InputMaybe<Scalars['Float']['input']>;
  lesserThan?: InputMaybe<Scalars['Float']['input']>;
  notEqual?: InputMaybe<Scalars['Float']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};


export type RouteTemplatePenaltyArgs = {
  equal?: InputMaybe<Scalars['Float']['input']>;
  greaterEqual?: InputMaybe<Scalars['Float']['input']>;
  greaterThan?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  lesserEqual?: InputMaybe<Scalars['Float']['input']>;
  lesserThan?: InputMaybe<Scalars['Float']['input']>;
  notEqual?: InputMaybe<Scalars['Float']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};


export type RouteTemplateRidersArgs = {
  equal?: InputMaybe<Scalars['Float']['input']>;
  greaterEqual?: InputMaybe<Scalars['Float']['input']>;
  greaterThan?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  lesserEqual?: InputMaybe<Scalars['Float']['input']>;
  lesserThan?: InputMaybe<Scalars['Float']['input']>;
  notEqual?: InputMaybe<Scalars['Float']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};


export type RouteTemplateStart_TimeArgs = {
  greaterEqual?: InputMaybe<Scalars['Datetime']['input']>;
  greaterThan?: InputMaybe<Scalars['Datetime']['input']>;
  lesserEqual?: InputMaybe<Scalars['Datetime']['input']>;
  lesserThan?: InputMaybe<Scalars['Datetime']['input']>;
};


export type RouteTemplateUpdated_OnArgs = {
  greaterEqual?: InputMaybe<Scalars['Datetime']['input']>;
  greaterThan?: InputMaybe<Scalars['Datetime']['input']>;
  lesserEqual?: InputMaybe<Scalars['Datetime']['input']>;
  lesserThan?: InputMaybe<Scalars['Datetime']['input']>;
};


export type RouteTemplateVehicle_CapacityArgs = {
  equal?: InputMaybe<Scalars['Float']['input']>;
  greaterEqual?: InputMaybe<Scalars['Float']['input']>;
  greaterThan?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  lesserEqual?: InputMaybe<Scalars['Float']['input']>;
  lesserThan?: InputMaybe<Scalars['Float']['input']>;
  notEqual?: InputMaybe<Scalars['Float']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};


export type RouteTemplateWaiting_Time_Per_VehicleArgs = {
  equal?: InputMaybe<Scalars['Float']['input']>;
  greaterEqual?: InputMaybe<Scalars['Float']['input']>;
  greaterThan?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  lesserEqual?: InputMaybe<Scalars['Float']['input']>;
  lesserThan?: InputMaybe<Scalars['Float']['input']>;
  notEqual?: InputMaybe<Scalars['Float']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};

export type RouteTemplateInput = {
  auto_assign_riders?: InputMaybe<Scalars['Boolean']['input']>;
  avg_speed?: InputMaybe<Scalars['Int']['input']>;
  company_id?: InputMaybe<Scalars['String']['input']>;
  created_on?: InputMaybe<Scalars['Datetime']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  is_first_stop_hub?: InputMaybe<Scalars['Boolean']['input']>;
  is_last_stop_hub?: InputMaybe<Scalars['Boolean']['input']>;
  max_time_minute?: InputMaybe<Scalars['Int']['input']>;
  max_travel_km?: InputMaybe<Scalars['Int']['input']>;
  penalty?: InputMaybe<Scalars['Int']['input']>;
  riders?: InputMaybe<Scalars['Int']['input']>;
  start_time?: InputMaybe<Scalars['Datetime']['input']>;
  updated_on?: InputMaybe<Scalars['Datetime']['input']>;
  vehicle_capacity?: InputMaybe<Scalars['Int']['input']>;
  waiting_time_per_vehicle?: InputMaybe<Scalars['Int']['input']>;
};

export type RouteVehicleConfig = {
  __typename?: 'RouteVehicleConfig';
  capacity: Scalars['Int']['output'];
  category_id?: Maybe<Scalars['String']['output']>;
  category_name?: Maybe<Scalars['String']['output']>;
  company_id: Scalars['String']['output'];
  count: Scalars['Int']['output'];
  created_on: Scalars['Datetime']['output'];
  id: Scalars['Int']['output'];
  range: Scalars['Int']['output'];
  route: Route;
  route_id: Scalars['Int']['output'];
  updated_on: Scalars['Datetime']['output'];
};


export type RouteVehicleConfigCapacityArgs = {
  equal?: InputMaybe<Scalars['Float']['input']>;
  greaterEqual?: InputMaybe<Scalars['Float']['input']>;
  greaterThan?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  lesserEqual?: InputMaybe<Scalars['Float']['input']>;
  lesserThan?: InputMaybe<Scalars['Float']['input']>;
  notEqual?: InputMaybe<Scalars['Float']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};


export type RouteVehicleConfigCategory_IdArgs = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equal?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  notEqual?: InputMaybe<Scalars['String']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};


export type RouteVehicleConfigCategory_NameArgs = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equal?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  notEqual?: InputMaybe<Scalars['String']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};


export type RouteVehicleConfigCompany_IdArgs = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equal?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  notEqual?: InputMaybe<Scalars['String']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};


export type RouteVehicleConfigCountArgs = {
  equal?: InputMaybe<Scalars['Float']['input']>;
  greaterEqual?: InputMaybe<Scalars['Float']['input']>;
  greaterThan?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  lesserEqual?: InputMaybe<Scalars['Float']['input']>;
  lesserThan?: InputMaybe<Scalars['Float']['input']>;
  notEqual?: InputMaybe<Scalars['Float']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};


export type RouteVehicleConfigCreated_OnArgs = {
  greaterEqual?: InputMaybe<Scalars['Datetime']['input']>;
  greaterThan?: InputMaybe<Scalars['Datetime']['input']>;
  lesserEqual?: InputMaybe<Scalars['Datetime']['input']>;
  lesserThan?: InputMaybe<Scalars['Datetime']['input']>;
};


export type RouteVehicleConfigIdArgs = {
  equal?: InputMaybe<Scalars['Float']['input']>;
  greaterEqual?: InputMaybe<Scalars['Float']['input']>;
  greaterThan?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  lesserEqual?: InputMaybe<Scalars['Float']['input']>;
  lesserThan?: InputMaybe<Scalars['Float']['input']>;
  notEqual?: InputMaybe<Scalars['Float']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};


export type RouteVehicleConfigRangeArgs = {
  equal?: InputMaybe<Scalars['Float']['input']>;
  greaterEqual?: InputMaybe<Scalars['Float']['input']>;
  greaterThan?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  lesserEqual?: InputMaybe<Scalars['Float']['input']>;
  lesserThan?: InputMaybe<Scalars['Float']['input']>;
  notEqual?: InputMaybe<Scalars['Float']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};


export type RouteVehicleConfigRoute_IdArgs = {
  equal?: InputMaybe<Scalars['Float']['input']>;
  greaterEqual?: InputMaybe<Scalars['Float']['input']>;
  greaterThan?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  lesserEqual?: InputMaybe<Scalars['Float']['input']>;
  lesserThan?: InputMaybe<Scalars['Float']['input']>;
  notEqual?: InputMaybe<Scalars['Float']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};


export type RouteVehicleConfigUpdated_OnArgs = {
  greaterEqual?: InputMaybe<Scalars['Datetime']['input']>;
  greaterThan?: InputMaybe<Scalars['Datetime']['input']>;
  lesserEqual?: InputMaybe<Scalars['Datetime']['input']>;
  lesserThan?: InputMaybe<Scalars['Datetime']['input']>;
};

export type RouteVehicleConfigInput = {
  capacity?: InputMaybe<Scalars['Int']['input']>;
  category_id?: InputMaybe<Scalars['String']['input']>;
  category_name?: InputMaybe<Scalars['String']['input']>;
  company_id?: InputMaybe<Scalars['String']['input']>;
  count?: InputMaybe<Scalars['Int']['input']>;
  created_on?: InputMaybe<Scalars['Datetime']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  range?: InputMaybe<Scalars['Int']['input']>;
  route?: InputMaybe<RouteInput>;
  route_id?: InputMaybe<Scalars['Int']['input']>;
  updated_on?: InputMaybe<Scalars['Datetime']['input']>;
};

export type TokenResponse = {
  __typename?: 'TokenResponse';
  access_token: Scalars['String']['output'];
  refresh_token: Scalars['String']['output'];
  user_id: Scalars['ID']['output'];
};

export type TouchPoint = {
  __typename?: 'TouchPoint';
  address?: Maybe<Scalars['String']['output']>;
  category_type: Scalars['String']['output'];
  closing_time?: Maybe<Scalars['Time']['output']>;
  company_id: Scalars['String']['output'];
  created_on: Scalars['Datetime']['output'];
  customer_name?: Maybe<Scalars['String']['output']>;
  customer_phone?: Maybe<Scalars['String']['output']>;
  external_id?: Maybe<Scalars['String']['output']>;
  geom?: Maybe<Geom>;
  id: Scalars['Int']['output'];
  opening_time?: Maybe<Scalars['Time']['output']>;
  pincode?: Maybe<Scalars['String']['output']>;
  routing_id: Scalars['Int']['output'];
  shipment_id?: Maybe<Scalars['String']['output']>;
  touch_point_status: TouchPointStatus;
  touch_point_type: TouchPointType;
  updated_on: Scalars['Datetime']['output'];
  weight: Scalars['Float']['output'];
};


export type TouchPointAddressArgs = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equal?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  notEqual?: InputMaybe<Scalars['String']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};


export type TouchPointCategory_TypeArgs = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equal?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  notEqual?: InputMaybe<Scalars['String']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};


export type TouchPointClosing_TimeArgs = {
  greaterEqual?: InputMaybe<Scalars['Time']['input']>;
  greaterThan?: InputMaybe<Scalars['Time']['input']>;
  lesserEqual?: InputMaybe<Scalars['Time']['input']>;
  lesserThan?: InputMaybe<Scalars['Time']['input']>;
};


export type TouchPointCompany_IdArgs = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equal?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  notEqual?: InputMaybe<Scalars['String']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};


export type TouchPointCreated_OnArgs = {
  greaterEqual?: InputMaybe<Scalars['Datetime']['input']>;
  greaterThan?: InputMaybe<Scalars['Datetime']['input']>;
  lesserEqual?: InputMaybe<Scalars['Datetime']['input']>;
  lesserThan?: InputMaybe<Scalars['Datetime']['input']>;
};


export type TouchPointCustomer_NameArgs = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equal?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  notEqual?: InputMaybe<Scalars['String']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};


export type TouchPointCustomer_PhoneArgs = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equal?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  notEqual?: InputMaybe<Scalars['String']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};


export type TouchPointExternal_IdArgs = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equal?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  notEqual?: InputMaybe<Scalars['String']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};


export type TouchPointIdArgs = {
  equal?: InputMaybe<Scalars['Float']['input']>;
  greaterEqual?: InputMaybe<Scalars['Float']['input']>;
  greaterThan?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  lesserEqual?: InputMaybe<Scalars['Float']['input']>;
  lesserThan?: InputMaybe<Scalars['Float']['input']>;
  notEqual?: InputMaybe<Scalars['Float']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};


export type TouchPointOpening_TimeArgs = {
  greaterEqual?: InputMaybe<Scalars['Time']['input']>;
  greaterThan?: InputMaybe<Scalars['Time']['input']>;
  lesserEqual?: InputMaybe<Scalars['Time']['input']>;
  lesserThan?: InputMaybe<Scalars['Time']['input']>;
};


export type TouchPointPincodeArgs = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equal?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  notEqual?: InputMaybe<Scalars['String']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};


export type TouchPointRouting_IdArgs = {
  equal?: InputMaybe<Scalars['Float']['input']>;
  greaterEqual?: InputMaybe<Scalars['Float']['input']>;
  greaterThan?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  lesserEqual?: InputMaybe<Scalars['Float']['input']>;
  lesserThan?: InputMaybe<Scalars['Float']['input']>;
  notEqual?: InputMaybe<Scalars['Float']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};


export type TouchPointShipment_IdArgs = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equal?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  notEqual?: InputMaybe<Scalars['String']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};


export type TouchPointUpdated_OnArgs = {
  greaterEqual?: InputMaybe<Scalars['Datetime']['input']>;
  greaterThan?: InputMaybe<Scalars['Datetime']['input']>;
  lesserEqual?: InputMaybe<Scalars['Datetime']['input']>;
  lesserThan?: InputMaybe<Scalars['Datetime']['input']>;
};


export type TouchPointWeightArgs = {
  equal?: InputMaybe<Scalars['Float']['input']>;
  greaterEqual?: InputMaybe<Scalars['Float']['input']>;
  greaterThan?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  lesserEqual?: InputMaybe<Scalars['Float']['input']>;
  lesserThan?: InputMaybe<Scalars['Float']['input']>;
  notEqual?: InputMaybe<Scalars['Float']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};

export type TouchPointInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  category_type?: InputMaybe<Scalars['String']['input']>;
  closing_time?: InputMaybe<Scalars['Time']['input']>;
  company_id?: InputMaybe<Scalars['String']['input']>;
  created_on?: InputMaybe<Scalars['Datetime']['input']>;
  customer_name?: InputMaybe<Scalars['String']['input']>;
  customer_phone?: InputMaybe<Scalars['String']['input']>;
  external_id?: InputMaybe<Scalars['String']['input']>;
  geom?: InputMaybe<GeomInput>;
  id?: InputMaybe<Scalars['Int']['input']>;
  opening_time?: InputMaybe<Scalars['Time']['input']>;
  pincode?: InputMaybe<Scalars['String']['input']>;
  routing_id?: InputMaybe<Scalars['Int']['input']>;
  shipment_id?: InputMaybe<Scalars['String']['input']>;
  touch_point_status?: InputMaybe<TouchPointStatus>;
  touch_point_type?: InputMaybe<TouchPointType>;
  updated_on?: InputMaybe<Scalars['Datetime']['input']>;
  weight?: InputMaybe<Scalars['Float']['input']>;
};

export type TouchPointOutput = {
  __typename?: 'TouchPointOutput';
  address?: Maybe<Scalars['String']['output']>;
  category_type?: Maybe<Scalars['String']['output']>;
  closing_time?: Maybe<Scalars['String']['output']>;
  external_id?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  latitude?: Maybe<Scalars['Float']['output']>;
  longitude?: Maybe<Scalars['Float']['output']>;
  opening_time?: Maybe<Scalars['String']['output']>;
  pincode?: Maybe<Scalars['String']['output']>;
  shipment_id?: Maybe<Scalars['String']['output']>;
  touch_point_type?: Maybe<Scalars['String']['output']>;
  weight?: Maybe<Scalars['Float']['output']>;
};

export enum TouchPointStatus {
  Completed = 'COMPLETED',
  Invalid = 'INVALID',
  Pending = 'PENDING',
  Processing = 'PROCESSING'
}

export enum TouchPointStatusType {
  Completed = 'COMPLETED',
  Incomplete = 'INCOMPLETE'
}

export enum TouchPointType {
  Drop = 'DROP',
  Pickup = 'PICKUP'
}

export type UserResponse = {
  __typename?: 'UserResponse';
  name: Scalars['String']['output'];
};

export type Zone = {
  __typename?: 'Zone';
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
};

export type Get_Tasks_Statuses_Response = {
  __typename?: 'get_tasks_statuses_response';
  data?: Maybe<Scalars['JSON']['output']>;
};

export type Task_Status_Response = {
  __typename?: 'task_status_response';
  data?: Maybe<Scalars['JSON']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['String']['output']>;
};
