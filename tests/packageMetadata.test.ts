import packageJson from '../package.json';

const packageMetadata = packageJson as typeof packageJson & {
	dependencies?: Record<string, string>;
};

describe('package metadata', () => {
	it('uses the expected n8n community node package metadata', () => {
		expect(packageJson.name).toMatch(/^(@[^/]+\/)?n8n-nodes-/);
		expect(packageJson.keywords).toContain('n8n-community-node-package');
		expect(packageJson.license).toBe('MIT');
		expect(packageJson.n8n).toBeDefined();
		expect(packageJson.n8n.n8nNodesApiVersion).toBe(1);
		expect(packageJson.n8n.nodes).toEqual(
			expect.arrayContaining(['dist/nodes/CrownpeakFS/CrownpeakFS.node.js']),
		);
		expect(packageJson.n8n.credentials).toEqual(
			expect.arrayContaining([
				'dist/nodes/CrownpeakFS/credentials/CrownpeakFSApi.credentials',
			]),
		);
	});

	it('does not declare runtime dependencies for verified-community readiness', () => {
		expect(packageMetadata.dependencies ?? {}).toEqual({});
	});

	it('declares n8n-workflow as a peer dependency', () => {
		expect(packageJson.peerDependencies).toHaveProperty('n8n-workflow');
	});
});
