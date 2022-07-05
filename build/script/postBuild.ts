// #!/usr/bin/env node

import { argv } from 'yargs';
import { runBuildConfig } from './buildConf';
import chalk from 'chalk';

import pkg from '../../package.json';

// ↓定义创建配置文件的方法，最条件判断
export const runBuild = async () => {
  try {
    // 获取命令中不以'-'开头的参数
    const argvList = argv._;

    // Generate configuration file
    // ↓如果参数中包含'no-conf'，那么就不创建配置文件
    if (!argvList.includes('no-conf')) {
      // ↓同步创建配置文件
      await runBuildConfig();
    }

    console.log(`✨ ${chalk.cyan(`[${pkg.name}]`)}` + ' - build successfully!');
  } catch (error) {
    console.log(chalk.red('vite build error:\n' + error));
    process.exit(1);
  }
};

// ↓执行方法
runBuild();

