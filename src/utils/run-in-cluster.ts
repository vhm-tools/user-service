import * as cluster from 'cluster';
import * as os from 'os';
import { isProduction } from '@infra-common/helpers';

export const runInCluster = (bootstrap: () => Promise<void>) => {
  const clusterLib: any = cluster;
  const numberOfCores = os.cpus().length;

  if (clusterLib.isPrimary && isProduction) {
    for (let i = 0; i < numberOfCores; i++) {
      clusterLib.fork();
    }
  } else {
    bootstrap();
  }
};
