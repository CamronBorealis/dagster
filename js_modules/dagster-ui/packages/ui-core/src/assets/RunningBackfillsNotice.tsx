import {gql, useQuery} from '@apollo/client';
import {Box, Icon, colorLinkDefault, colorTextLight} from '@dagster-io/ui-components';
import React from 'react';
import {Link} from 'react-router-dom';

import {
  RunningBackfillsNoticeQuery,
  RunningBackfillsNoticeQueryVariables,
} from './types/RunningBackfillsNotice.types';

export const RunningBackfillsNotice = ({partitionSetName}: {partitionSetName: string}) => {
  const {data} = useQuery<RunningBackfillsNoticeQuery, RunningBackfillsNoticeQueryVariables>(
    RUNNING_BACKFILLS_NOTICE_QUERY,
  );

  const runningBackfills =
    data?.partitionBackfillsOrError.__typename === 'PartitionBackfills'
      ? data.partitionBackfillsOrError.results
      : [];

  const runningBackfillCount = runningBackfills.filter(
    (r) => r.partitionSetName === partitionSetName,
  ).length;

  if (runningBackfillCount === 0) {
    return <span />;
  }
  return (
    <div style={{color: colorTextLight(), maxWidth: 350}}>
      {runningBackfillCount === 1
        ? 'Note: A backfill has been requested for this job and may be refreshing displayed assets. '
        : `Note: ${runningBackfillCount} backfills have been requested for this job and may be refreshing displayed assets. `}
      <Link to="/overview/backfills" target="_blank">
        <Box flex={{gap: 4, display: 'inline-flex', alignItems: 'center'}}>
          View <Icon name="open_in_new" color={colorLinkDefault()} />
        </Box>
      </Link>
    </div>
  );
};

export const RUNNING_BACKFILLS_NOTICE_QUERY = gql`
  query RunningBackfillsNoticeQuery {
    partitionBackfillsOrError(status: REQUESTED) {
      ... on PartitionBackfills {
        results {
          id
          partitionSetName
        }
      }
    }
  }
`;
