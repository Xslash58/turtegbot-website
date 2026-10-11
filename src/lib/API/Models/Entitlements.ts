import type { SimulationNodeDatum, SimulationLinkDatum } from 'd3-force';

export type EntitlementKind =
  | 'USER'
  | 'ROLE'
  | 'PERMISSION'
  | 'BADGE'
  | 'BUNDLE'
  | 'SPECIAL_EVENT'
  | 'PRODUCT'
  | string;

export interface EntitlementGraphNodeDto {
  id: string;
  label: string;
  kind: EntitlementKind;
  description?: string | null;
  metadata?: Record<string, unknown> | null;
  priority: number;
}

export interface EntitlementGraphLinkDto {
  source: string;
  target: string;
}

export interface EntitlementGraphResponse {
  nodes: EntitlementGraphNodeDto[];
  links: EntitlementGraphLinkDto[];
}

export interface SimulationGraphNode extends EntitlementGraphNodeDto, SimulationNodeDatum {
  radius?: number;
}

export interface SimulationGraphLink extends SimulationLinkDatum<SimulationGraphNode> {
  source: string | SimulationGraphNode;
  target: string | SimulationGraphNode;
}

export interface Entitlement {
  id: string;
  kind: EntitlementKind;
  name: string;
  description: string;
  priority: number;
  metadata?: JSON | null;
}