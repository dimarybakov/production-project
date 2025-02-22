import webpack, { DefinePlugin, RuleSetRule } from 'webpack';
import path from 'path';
import { BuildPaths } from '../build/types/config';
import { buildCssLoader } from '../build/loaders/buildCssLoader';

export default ({ config }: { config: webpack.Configuration }) => {
  const paths: BuildPaths = {
    build: '',
    html: '',
    entry: '',
    src: path.resolve(__dirname, '..', '..', 'src'),
  };
  // config.resolve?.modules?.push(paths.src);
  config!.resolve!.modules!.push(
    path.relative(__dirname, './src'),
    'node_modules',
  );
  // config.resolve?.modules = [paths.src, 'node_modules'];
  config!.resolve!.extensions!.push('.ts', '.tsx', '.js');

  // if (config.module) {
  //   // eslint-disable-next-line no-param-reassign
  //   config.module.rules = config.module?.rules?.map((rule: RuleSetRule) => {
  //     if (/svg/.test(rule.test as string)) {
  //       return { ...rule, exclude: /\.svg$/i };
  //     }

  //     return rule;
  //   });
  // }

  if (config!.module!.rules) {
    // eslint-disable-next-line no-param-reassign
    config.module!.rules = config.module!.rules!.map(
      (rule: RuleSetRule | null | undefined | false | 0 | '' | '...') => {
        if (rule && rule !== '...' && /svg/.test(rule.test as string)) {
          return { ...rule, exclude: /\.svg$/i };
        }

        return rule;
      },
    );
  }

  config.module?.rules?.push({
    test: /\.svg$/,
    use: ['@svgr/webpack'],
  });
  config!.module!.rules!.push(buildCssLoader(true));

  config!.plugins!.push(
    new DefinePlugin({
      __IS_DEV__: JSON.stringify(true),
      __API__: JSON.stringify(''),
      __PROJECT__: JSON.stringify('storybook'),
    }),
  );

  return config;
};
