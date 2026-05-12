import fs from 'node:fs';
import path from 'node:path';
import packageJson from '../package.json';

const nodeSourcePath = path.join(__dirname, '..', 'nodes', 'CrownpeakFS', 'CrownpeakFS.node.ts');
const packageMetadata = packageJson as typeof packageJson & {
	dependencies?: Record<string, string>;
};

describe('verified-compatible runtime constraints', () => {
	const nodeSource = fs.readFileSync(nodeSourcePath, 'utf8');

	it('does not import filesystem modules in runtime node code', () => {
		expect(nodeSource).not.toMatch(/from 'node:fs'|from "node:fs"|from 'fs'|from "fs"/);
	});

	it('does not import path for runtime file uploads', () => {
		expect(nodeSource).not.toMatch(/from 'node:path'|from "node:path"|from 'path'|from "path"/);
	});

	it('does not import form-data', () => {
		expect(nodeSource).not.toMatch(/from 'form-data'|from "form-data"/);
	});

	it('does not declare runtime dependencies', () => {
		expect(packageMetadata.dependencies ?? {}).toEqual({});
	});

	it('does not contain the legacy descriptions/CrownpeakFS.node.options.ts file', () => {
		const legacyOptionsPath = path.join(
			__dirname,
			'..',
			'nodes',
			'CrownpeakFS',
			'descriptions',
			'CrownpeakFS.node.options.ts',
		);
		expect(fs.existsSync(legacyOptionsPath)).toBe(false);
	});
});
