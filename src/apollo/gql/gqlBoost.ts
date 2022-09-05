export const SAVE_POWER_BOOSTING = ` 
mutation setSinglePowerBoostingMutation ($projectId: Int!, $percentage: Float!) { 
  setSinglePowerBoosting(projectId: $projectId, percentage: $percentage) { 
	id 
	user { 
	  id 
	} 
	project { 
	  id 
	} 
	percentage 
  } 
} 
`;

export const SAVE_MULTIPLE_POWER_BOOSTING = ` 
mutation setMultiplePowerBoostingMutation($projectIds: [Int!]!, $percentages: [Float!]!) { 
  setMultiplePowerBoosting(projectIds: $projectIds, percentages: $percentages) { 
	id 
	user { 
	  id 
	} 
	project { 
	  id 
	} 
	percentage 
  } 
} 
`;

export const FETCH_POWER_BOOSTING = ` 
   query getPowerBoostingsQuery( 
     $take: Int 
     $skip: Int 
     $orderBy: PowerBoostingOrderBy 
     $projectId: Int 
     $userId: Int 
   ) { 
     getPowerBoosting( 
       take: $take 
       skip: $skip 
       orderBy: $orderBy 
       projectId: $projectId 
       userId: $userId 
     ) { 
       powerBoostings { 
             id 
             user { 
               id 
               email 
             } 
             project { 
               id 
             } 
             percentage 
       }       
     } 
   } 
 `;
