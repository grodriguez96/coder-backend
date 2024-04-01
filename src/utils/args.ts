import { Command } from 'commander';

const args = new Command();
args.parse();

args.option("--env <env>", "environment", "prod");

export default args.opts();
