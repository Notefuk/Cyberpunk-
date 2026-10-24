// Corre el CLI de Firebase con el JDK 21 portátil de .tools/jdk-21 si existe (v5.0.0, plan 16). [Claude Code · 2026-10-24]
// El emulador de Firestore exige Java 21+; así no hace falta cambiar el Java instalado en el sistema.
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const jdk = path.resolve(here, '..', '..', '.tools', 'jdk-21');
const env = { ...process.env };
if (existsSync(path.join(jdk, 'bin'))) {
  env.JAVA_HOME = jdk;
  env.PATH = `${path.join(jdk, 'bin')}${path.delimiter}${env.PATH ?? ''}`;
}
// En Windows, Java 21 abre sus pipes internos con sockets Unix en la carpeta temporal; con la ruta corta
// del TEMP falla ("Unable to establish loopback connection"). Se le da una carpeta propia dentro de .tools/.
const udsTmp = path.resolve(here, '..', '..', '.tools', 'udstmp');
mkdirSync(udsTmp, { recursive: true });
env.JAVA_TOOL_OPTIONS = `${env.JAVA_TOOL_OPTIONS ?? ''} -Djdk.net.unixdomain.tmpdir=${udsTmp}`.trim();

// Se llama al CLI con el mismo Node, sin shell, para que los argumentos con comillas lleguen intactos.
const cli = path.resolve(here, '..', 'node_modules', 'firebase-tools', 'lib', 'bin', 'firebase.js');
const child = spawn(process.execPath, [cli, ...process.argv.slice(2)], { stdio: 'inherit', env });
child.on('exit', (code) => process.exit(code ?? 1));
