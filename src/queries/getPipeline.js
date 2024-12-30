const getPipelineByAlias = (alias) =>{
  const pipeline = [
    { $match: { alias } }, // Filter by alias
    {
      $group: {
        _id: {
          date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }, // Group by date
          osType: '$osType', // Group by OS type
          deviceType: '$deviceType', // Group by device type
        },
        usernames: { $addToSet: '$username' }, // Collect unique usernames
        ipAddresses: { $addToSet: '$ipAddress' }, // Collect unique IP addresses
        clickCount: { $sum: 1 }, // Count clicks
      },
    },
    {
      $group: {
        _id: '$_id.date', // Group by date only
        totalClicks: { $sum: '$clickCount' }, // Total clicks per date
        osType: {
          $push: {
            osName: '$_id.osType', // OS type
            uniqueClicks: { $size: '$ipAddresses' }, // Count unique IPs for each OS type
            uniqueUsers: { $size: '$usernames' }, // Count unique users for each OS type
          },
        },
        deviceType: {
          $push: {
            deviceName: '$_id.deviceType', // Device type
            uniqueClicks: { $size: '$ipAddresses' }, // Count unique IPs for each device type
            uniqueUsers: { $size: '$usernames' }, // Count unique users for each device type
          },
        },
        uniqueUsers: { $addToSet: '$usernames' }, // Collect unique usernames per date
        uniqueClicks: { $addToSet: '$ipAddresses' }, // Collect unique IPs per date
      },
    },
    {
      $sort: { _id: -1 }, // Sort by date in descending order
    },
    {
      $limit: 7, // Take the most recent 7 dates
    },
    {
      $project: {
        _id: 1, // Date
        clickCount: '$totalClicks', // Total clicks
        uniqueUsers: { $size: '$uniqueUsers' }, // Number of unique users
        uniqueClicks: { $size: '$uniqueClicks' }, // Number of unique IPs
        osType: 1, // OS type breakdown
        deviceType: 1, // Device type breakdown
      },
    },
    {
      $group: {
        _id: null,
        clicksByDate: {
          $push: {
            date: '$_id',
            clickCount: '$clickCount',
          },
        },
        totalClicks: { $sum: '$clickCount' }, // Sum total clicks for the 7 days
        osType: { $push: '$osType' }, // Aggregate OS type breakdown
        deviceType: { $push: '$deviceType' }, // Aggregate device type breakdown
        uniqueUsers: { $addToSet: '$uniqueUsers' }, // Aggregate unique users
        uniqueClicks: { $addToSet: '$uniqueClicks' }, // Aggregate unique IPs
      },
    },
    {
      $project: {
        _id: 0,
        totalClicks: 1,
        osType: { $reduce: { input: '$osType', initialValue: [], in: { $concatArrays: ['$$value', '$$this'] } } }, // Flatten OS type
        deviceType: { $reduce: { input: '$deviceType', initialValue: [], in: { $concatArrays: ['$$value', '$$this'] } } }, // Flatten device type
        uniqueUsers: { $size: '$uniqueUsers' }, // Final count of unique users
        uniqueClicks: { $size: '$uniqueClicks' }, // Final count of unique clicks
        clicksByDate: 1, // Recent 7 days data
      },
    },
  ];
  return pipeline;
};

const getPipelineByTopic = (topic) =>{
  const pipeline = [
    { $match: { topic } }, // Filter by topic
    {
      $group: {
        _id: {
          alias: '$alias', // Group by short URL alias
          date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }, // Group by date
        },
        clickCount: { $sum: 1 }, // Count clicks
        uniqueUsers: { $addToSet: '$username' }, // Collect unique usernames
        uniqueClicks: { $addToSet: '$ipAddress' }, // Collect unique IPs
      },
    },
    {
      $group: {
        _id: '$_id.date', // Group by date
        totalClicks: { $sum: '$clickCount' }, // Total clicks for the date
        aliases: {
          $push: {
            alias: '$_id.alias',
            clickCount: '$clickCount',
            uniqueUsers: { $size: '$uniqueUsers' },
            uniqueClicks: { $size: '$uniqueClicks' },
          },
        },
        uniqueUsers: { $addToSet: '$uniqueUsers' }, // Collect unique users across aliases
        uniqueClicks: { $addToSet: '$uniqueClicks' }, // Collect unique clicks across aliases
      },
    },
    { $sort: { _id: -1 } }, // Sort by date in descending order
    { $limit: 7 }, // Take the most recent 7 dates
    {
      $project: {
        _id: 1, // Keep the date as is
        totalClicks: 1, // Total clicks for the date
        aliases: 1, // Alias-specific analytics
        uniqueUsers: {
          $reduce: {
            input: '$uniqueUsers',
            initialValue: [],
            in: { $concatArrays: ['$$value', { $cond: { if: { $isArray: '$$this' }, then: '$$this', else: ['$$this'] } }] },
          }
        },
        uniqueClicks: {
          $reduce: {
            input: '$uniqueClicks',
            initialValue: [],
            in: { $concatArrays: ['$$value', { $cond: { if: { $isArray: '$$this' }, then: '$$this', else: ['$$this'] } }] },
          }
        },
      },
    },
    {
      $group: {
        _id: null,
        clicksByDate: {
          $push: {
            date: '$_id',
            clickCount: '$totalClicks',
          },
        },
        urls: { $push: '$aliases' },
        totalClicks: { $sum: '$totalClicks' },
        uniqueUsers: { $addToSet: '$uniqueUsers' },
        uniqueClicks: { $addToSet: '$uniqueClicks' },
      },
    },
    {
      $project: {
        _id: 0,
        totalClicks: 1,
        clicksByDate: 1,
        urls: {
          $reduce: {
            input: '$urls',
            initialValue: [],
            in: { $concatArrays: ['$$value', '$$this'] },
          }
        },
        uniqueUsers: { $size: '$uniqueUsers' },
        uniqueClicks: { $size: '$uniqueClicks' },
      },
    },
  ];
  return pipeline;
}

const getOverallPipeline = () =>{
  const pipeline = [
    {
      "$facet": {
        "totalUrls": [
          {
            "$group": {
              "_id": "$alias",
              "count": { "$sum": 1 }
            }
          },
          {
            "$count": "totalUrls"
          }
        ],
        "totalClicks": [
          {
            "$count": "totalClicks"
          }
        ],
        "uniqueUsers": [
          {
            "$group": {
              "_id": "$ipAddress"
            }
          },
          {
            "$count": "uniqueUsers"
          }
        ],
        "clicksByDate": [
          {
            "$group": {
              "_id": { "$dateToString": { "format": "%Y-%m-%d", "date": "$timestamp" } },
              "totalClicks": { "$sum": 1 }
            }
          },
          {
            "$sort": { "_id": -1 }
          },
          {
            "$limit": 7
          },
          {
            "$project": {
              "date": "$_id",
              "totalClicks": 1,
              "_id": 0
            }
          }
        ],
        "osType": [
          {
            "$group": {
              "_id": "$osType",
              "uniqueClicks": { "$addToSet": "$ipAddress" },
              "uniqueUsers": { "$addToSet": "$username" }
            }
          },
          {
            "$project": {
              "osName": "$_id",
              "uniqueClicks": { "$size": "$uniqueClicks" },
              "uniqueUsers": { "$size": "$uniqueUsers" },
              "_id": 0
            }
          }
        ],
        "deviceType": [
          {
            "$group": {
              "_id": "$deviceType",
              "uniqueClicks": { "$addToSet": "$ipAddress" },
              "uniqueUsers": { "$addToSet": "$username" }
            }
          },
          {
            "$project": {
              "deviceName": "$_id",
              "uniqueClicks": { "$size": "$uniqueClicks" },
              "uniqueUsers": { "$size": "$uniqueUsers" },
              "_id": 0
            }
          }
        ]
      }
    },
    {
      "$project": {
        "totalUrls": { "$arrayElemAt": ["$totalUrls.totalUrls", 0] },
        "totalClicks": { "$arrayElemAt": ["$totalClicks.totalClicks", 0] },
        "uniqueUsers": { "$arrayElemAt": ["$uniqueUsers.uniqueUsers", 0] },
        "clicksByDate": "$clicksByDate",
        "osType": "$osType",
        "deviceType": "$deviceType"
      }
    }
  ]
  return pipeline;
}

module.exports.getPipelineByAlias = getPipelineByAlias;
module.exports.getPipelineByTopic = getPipelineByTopic;
module.exports.getOverallPipeline = getOverallPipeline;