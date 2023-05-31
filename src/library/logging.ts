import chalk from "chalk";

export default class Logging {
    public static info = (args: string) => {
        console.log(chalk.blue(`[${new Date().toLocaleString()}][INFO] ${args}`), typeof args === 'string' ? chalk.blueBright(args) : args);  
    }
}