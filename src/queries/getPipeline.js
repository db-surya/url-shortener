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
    { $match: {} }, // Filter by authenticated user ID
    {
      $group: {
        _id: {
          alias: '$alias', // Group by short URL alias
          date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }, // Group by date
        },
        clickCount: { $sum: 1 }, // Count total clicks
        uniqueUsers: { $addToSet: '$username' }, // Collect unique usernames
        uniqueClicks: { $addToSet: '$ipAddress' }, // Collect unique IPs
        osTypes: { $addToSet: '$osType' }, // Collect unique osTypes
        deviceTypes: { $addToSet: '$deviceType' }, // Collect unique deviceTypes
      },
    },
    {
      $group: {
        _id: '$_id.date', // Group by date
        totalClicks: { $sum: '$clickCount' }, // Total clicks for the date
        osTypes: { $push: '$osTypes' }, // Collect osTypes for the date
        deviceTypes: { $push: '$deviceTypes' }, // Collect deviceTypes for the date
        uniqueUsers: { $addToSet: '$uniqueUsers' }, // Collect unique users across dates
        uniqueClicks: { $addToSet: '$uniqueClicks' }, // Collect unique IPs across dates
      },
    },
    { $sort: { _id: -1 } }, // Sort by date in descending order
    {
      $group: {
        _id: null,
        clicksByDate: {
          $push: {
            date: '$_id',
            clickCount: '$totalClicks',
          },
        },
        osTypes: { $push: '$osTypes' }, // Aggregate OS type analytics
        deviceTypes: { $push: '$deviceTypes' }, // Aggregate device type analytics
        totalClicks: { $sum: '$totalClicks' }, // Total clicks across all URLs
        uniqueUsers: { $addToSet: '$uniqueUsers' }, // Collect unique users across all dates
        uniqueClicks: { $addToSet: '$uniqueClicks' }, // Collect unique IPs across all dates
      },
    },
    {
      $project: {
        _id: 0,
        totalUrls: { $size: { $ifNull: [{ $arrayElemAt: ['$osTypes', 0] }, []] } }, // Count of unique short URLs
        totalClicks: 1,
        clicksByDate: 1,
        osTypes: {
          $map: {
            input: { $ifNull: [{ $arrayElemAt: ['$osTypes', 0] }, []] }, // Flatten osTypes
            as: 'os',
            in: {
              osName: '$$os',
              uniqueClicks: {
                $size: {
                  $ifNull: [
                    { $cond: [{ $isArray: '$$os' }, '$$os', []] },
                    [],
                  ], // Ensure $$os is an array before applying $size
                },
              },
              uniqueUsers: {
                $size: {
                  $ifNull: [
                    { $cond: [{ $isArray: '$$os' }, '$$os', []] },
                    [],
                  ], // Ensure $$os is an array before applying $size
                },
              },
            },
          },
        },
        deviceTypes: {
          $map: {
            input: { $ifNull: [{ $arrayElemAt: ['$deviceTypes', 0] }, []] }, // Flatten deviceTypes
            as: 'device',
            in: {
              deviceName: '$$device',
              uniqueClicks: {
                $size: {
                  $ifNull: [
                    { $cond: [{ $isArray: '$$device' }, '$$device', []] },
                    [],
                  ], // Ensure $$device is an array before applying $size
                },
              },
              uniqueUsers: {
                $size: {
                  $ifNull: [
                    { $cond: [{ $isArray: '$$device' }, '$$device', []] },
                    [],
                  ], // Ensure $$device is an array before applying $size
                },
              },
            },
          },
        },
        uniqueUsers: { $size: { $ifNull: [{ $arrayElemAt: ['$uniqueUsers', 0] }, []] } }, // Count unique users across all dates
        uniqueClicks: { $size: { $ifNull: [{ $arrayElemAt: ['$uniqueClicks', 0] }, []] } }, // Count unique IPs across all dates
      },
    },
  ];
  return pipeline;
}

module.exports.getPipelineByAlias = getPipelineByAlias;
module.exports.getPipelineByTopic = getPipelineByTopic;
module.exports.getOverallPipeline = getOverallPipeline;