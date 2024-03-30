import { Command } from 'commander';

const args = new Command();
args.parse();

export default args.opts();
