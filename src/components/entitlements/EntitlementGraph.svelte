<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3-force';
	import { zoom } from 'd3-zoom';
	import { select } from 'd3-selection';
	import { drag } from 'd3-drag';
	import type {
		EntitlementGraphResponse,
		SimulationGraphLink,
		SimulationGraphNode
	} from '$lib/API/Models/Entitlements';

	export let data: EntitlementGraphResponse;
	export let requestedWidth: number | null = null;
	export let requestedHeight: number | null = null;
	
	let svgElement: SVGSVGElement;
	let gElement: SVGGElement;

	const KIND_COLORS: Record<string, string> = {
		USER: '#ff1744', // Red (Root User)
		ROLE: '#00e676', // Bright Green
		BADGE: '#2979ff', // Bright Blue
		BUNDLE: '#ff9100', // Orange
		PRODUCT: '#ffea00', // Yellow
		SPECIAL_EVENT: '#76ff03', // Lime Green
		PERMISSION: '#ffffff' // White
	};

	function getNodeColor(kind: string): string {
		return KIND_COLORS[kind.toUpperCase()] || '#b0bec5';
	}

	onMount(() => {
		if (!data || !data.nodes.length) return;

		const nodes: SimulationGraphNode[] = data.nodes.map((n) => ({ ...n }));
		const links: SimulationGraphLink[] = data.links.map((l) => ({ ...l }));

		const width = requestedWidth || svgElement.clientWidth || 1000;
		const height = requestedHeight || svgElement.clientHeight || 700;

		const simulation = d3
			.forceSimulation<SimulationGraphNode>(nodes)
			.force(
				'link',
				d3
					.forceLink<SimulationGraphNode, SimulationGraphLink>(links)
					.id((d) => d.id)
					.distance(80)
			)
			.force('charge', d3.forceManyBody().strength(-350)) // Repulsion
			.force('center', d3.forceCenter(width / 2, height / 2))
			.force('collision', d3.forceCollide().radius(25));

		const svg = select(svgElement);
		const g = select(gElement);

		const zoomBehavior = zoom<SVGSVGElement, unknown>()
			.scaleExtent([0.1, 4])
			.on('zoom', (event) => {
				g.attr('transform', event.transform);
			});

		svg.call(zoomBehavior);

		const link = g
			.append('g')
			.attr('stroke', '#555')
			.attr('stroke-opacity', 0.6)
			.attr('stroke-width', 1.5)
			.selectAll('line')
			.data(links)
			.join('line');

		const dragBehavior = drag<SVGGElement, SimulationGraphNode>()
			.on('start', (event, d) => {
				if (!event.active) simulation.alphaTarget(0.3).restart();
				d.fx = d.x;
				d.fy = d.y;
			})
			.on('drag', (event, d) => {
				d.fx = event.x;
				d.fy = event.y;
			})
			.on('end', (event, d) => {
				if (!event.active) simulation.alphaTarget(0);
				d.fx = null;
				d.fy = null;
			});

		const node = g
			.append('g')
			.selectAll<SVGGElement, SimulationGraphNode>('g')
			.data(nodes)
			.join('g')
			.attr('cursor', 'grab')
			.call(dragBehavior);

		node
			.append('circle')
			.attr('r', (d) => (d.kind === 'USER' ? 14 : 10))
			.attr('fill', (d) => getNodeColor(d.kind))
			.attr('stroke', '#111')
			.attr('stroke-width', 1.5);

		node
			.append('text')
			.text((d) => `${d.kind !== 'USER' ? d.kind.replace('_', ' ') + ': ' : ''}${d.label}`)
			.attr('x', 14)
			.attr('y', 4)
			.attr('fill', '#ffffff')
			.attr('font-size', '12px')
			.attr('font-family', 'sans-serif')
			.attr('pointer-events', 'none')
			.attr('stroke', '#000')
			.attr('stroke-width', 0.4);

		simulation.on('tick', () => {
			link
				.attr('x1', (d) => (d.source as SimulationGraphNode).x!)
				.attr('y1', (d) => (d.source as SimulationGraphNode).y!)
				.attr('x2', (d) => (d.target as SimulationGraphNode).x!)
				.attr('y2', (d) => (d.target as SimulationGraphNode).y!);

			node.attr('transform', (d) => `translate(${d.x},${d.y})`);
		});

		return () => {
			simulation.stop();
		};
	});
</script>

<div class="graph-container">
	<svg bind:this={svgElement}>
		<g bind:this={gElement}></g>
	</svg>
</div>

<style>
	.graph-container {
		width: 100%;
		flex: 1;
		min-height: 0;
		background-color: #121214;
		overflow: hidden;
	}

	svg {
		width: 100%;
		height: 100%;
		cursor: default;
	}
</style>
