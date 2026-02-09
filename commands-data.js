const splunkCommands = [
    {
        name: "search",
        category: "search",
        description: "The foundation of all Splunk queries. Searches through indexed data to find events matching specified criteria.",
        formula: "search <search-criteria>",
        usage: [
            "Find events containing specific keywords",
            "Filter data based on field values",
            "Narrow down results using boolean operators (AND, OR, NOT)",
            "Use wildcards for pattern matching"
        ],
        examples: [
            "search error",
            "search sourcetype=access_* status=404",
            "search host=webserver* AND (error OR warning)",
            "search index=main \"failed login\""
        ]
    },
    {
        name: "stats",
        category: "statistical",
        description: "Calculates aggregate statistics over the result set. Essential for summarizing and analyzing data.",
        formula: "stats <function>(<field>) [by <field-list>]",
        usage: [
            "Calculate count, sum, average, min, max of field values",
            "Group results by one or more fields",
            "Create statistical summaries of your data",
            "Generate metrics for dashboards and reports"
        ],
        examples: [
            "stats count by status",
            "stats avg(response_time) by host",
            "stats sum(bytes) as total_bytes by user",
            "stats count, avg(duration), max(cpu) by server"
        ]
    },
    {
        name: "table",
        category: "reporting",
        description: "Displays results in a tabular format with specified fields as columns.",
        formula: "table <field-list>",
        usage: [
            "Display specific fields in a clean table format",
            "Organize data for easy reading",
            "Select only relevant columns from search results",
            "Present data in reports and dashboards"
        ],
        examples: [
            "table _time, host, source, message",
            "table user, action, status, ip_address",
            "table timestamp, error_code, description",
            "table src_ip, dest_ip, bytes_sent, bytes_received"
        ]
    },
    {
        name: "chart",
        category: "reporting",
        description: "Creates charts and visualizations by computing statistics over time or other dimensions.",
        formula: "chart <function>(<field>) [over <row-split>] [by <column-split>]",
        usage: [
            "Create time-series visualizations",
            "Generate multi-series charts",
            "Compare metrics across different dimensions",
            "Build interactive dashboards"
        ],
        examples: [
            "chart count over _time by status",
            "chart avg(response_time) over host",
            "chart sum(sales) over region by product",
            "chart max(cpu_usage) over _time by server"
        ]
    },
    {
        name: "timechart",
        category: "time",
        description: "Creates time-based charts with automatic time bucketing. Specialized version of chart for time-series data.",
        formula: "timechart [span=<time>] <function>(<field>) [by <field>]",
        usage: [
            "Visualize trends over time",
            "Monitor metrics with time-based granularity",
            "Compare multiple series over time",
            "Detect patterns and anomalies in time-series data"
        ],
        examples: [
            "timechart span=1h count by sourcetype",
            "timechart avg(response_time)",
            "timechart span=5m sum(errors) by host",
            "timechart max(memory_usage) by server"
        ]
    },
    {
        name: "eval",
        category: "field",
        description: "Creates or modifies fields using expressions and functions. Powerful for data manipulation and calculations.",
        formula: "eval <field>=<expression>",
        usage: [
            "Create calculated fields",
            "Transform field values",
            "Perform mathematical operations",
            "Apply conditional logic with if/case statements"
        ],
        examples: [
            "eval duration=end_time-start_time",
            "eval status_label=if(status=200,\"OK\",\"Error\")",
            "eval GB=bytes/1024/1024/1024",
            "eval full_name=first_name.\" \".last_name"
        ]
    },
    {
        name: "where",
        category: "search",
        description: "Filters results using eval expressions. More flexible than search for complex conditions.",
        formula: "where <eval-expression>",
        usage: [
            "Filter using calculated fields",
            "Apply complex boolean logic",
            "Use functions in filter conditions",
            "Filter based on mathematical comparisons"
        ],
        examples: [
            "where response_time > 1000",
            "where status!=200 AND status!=201",
            "where isnotnull(error_message)",
            "where len(username) > 10"
        ]
    },
    {
        name: "rex",
        category: "field",
        description: "Extracts fields using regular expressions. Essential for parsing unstructured data.",
        formula: "rex [field=<field>] \"<regex-with-named-groups>\"",
        usage: [
            "Extract data from raw text",
            "Parse log formats",
            "Create fields from patterns",
            "Clean and structure unstructured data"
        ],
        examples: [
            "rex field=_raw \"user=(?<username>\\w+)\"",
            "rex \"(?<ip>\\d+\\.\\d+\\.\\d+\\.\\d+)\"",
            "rex field=message \"error code: (?<error_code>\\d+)\"",
            "rex \"duration=(?<duration>\\d+)ms\""
        ]
    },
    {
        name: "fields",
        category: "field",
        description: "Includes or excludes fields from search results. Improves performance by reducing data transfer.",
        formula: "fields [+|-] <field-list>",
        usage: [
            "Include only necessary fields",
            "Exclude unwanted fields",
            "Optimize search performance",
            "Reduce memory usage"
        ],
        examples: [
            "fields host, source, _time",
            "fields - _raw, _cd",
            "fields + user, action, status",
            "fields - internal_*"
        ]
    },
    {
        name: "dedup",
        category: "transforming",
        description: "Removes duplicate events based on specified fields. Keeps only unique combinations.",
        formula: "dedup [<number>] <field-list> [keepempty=<bool>] [consecutive=<bool>]",
        usage: [
            "Remove duplicate entries",
            "Get unique values",
            "Keep first N occurrences",
            "Clean up redundant data"
        ],
        examples: [
            "dedup user",
            "dedup host, source",
            "dedup 3 ip_address",
            "dedup user keepempty=true"
        ]
    },
    {
        name: "sort",
        category: "transforming",
        description: "Sorts search results by specified fields in ascending or descending order.",
        formula: "sort [<limit>] [+|-] <field-list>",
        usage: [
            "Order results by field values",
            "Get top or bottom N results",
            "Sort by multiple fields",
            "Organize data for presentation"
        ],
        examples: [
            "sort -_time",
            "sort +status, -response_time",
            "sort 10 -count",
            "sort host, source"
        ]
    },
    {
        name: "top",
        category: "statistical",
        description: "Returns the most common values for specified fields with count and percentage.",
        formula: "top [<limit>] <field-list> [by <field>]",
        usage: [
            "Find most frequent values",
            "Identify top contributors",
            "Analyze distribution of categorical data",
            "Generate frequency reports"
        ],
        examples: [
            "top user",
            "top 20 src_ip",
            "top status by host",
            "top product, category limit=10"
        ]
    },
    {
        name: "rare",
        category: "statistical",
        description: "Returns the least common values for specified fields. Opposite of top command.",
        formula: "rare [<limit>] <field-list> [by <field>]",
        usage: [
            "Find least frequent values",
            "Identify outliers",
            "Detect unusual patterns",
            "Analyze rare events"
        ],
        examples: [
            "rare user",
            "rare 10 error_code",
            "rare status by sourcetype",
            "rare country limit=5"
        ]
    },
    {
        name: "transaction",
        category: "transforming",
        description: "Groups events into transactions based on constraints like time, fields, or patterns.",
        formula: "transaction <field-list> [maxspan=<time>] [maxpause=<time>] [startswith=<pattern>] [endswith=<pattern>]",
        usage: [
            "Group related events together",
            "Track user sessions",
            "Analyze multi-step processes",
            "Calculate transaction duration"
        ],
        examples: [
            "transaction session_id maxspan=30m",
            "transaction user startswith=\"login\" endswith=\"logout\"",
            "transaction request_id maxpause=5s",
            "transaction host, process_id maxspan=1h"
        ]
    },
    {
        name: "join",
        category: "transforming",
        description: "Combines results from two searches based on common fields. Similar to SQL JOIN.",
        formula: "join [type=inner|left|outer] <field-list> [subsearch]",
        usage: [
            "Combine data from different sources",
            "Enrich events with additional information",
            "Correlate related datasets",
            "Perform lookups across indexes"
        ],
        examples: [
            "join user [search index=users | fields user, department]",
            "join type=left ip [search index=threats | fields ip, threat_level]",
            "join host, process [search index=inventory]",
            "join outer session_id [search index=transactions]"
        ]
    },
    {
        name: "lookup",
        category: "field",
        description: "Enriches events with data from lookup tables. Adds fields based on matching values.",
        formula: "lookup <lookup-table> <lookup-field> [AS <event-field>] [OUTPUT <field-list>]",
        usage: [
            "Add contextual information to events",
            "Map codes to descriptions",
            "Enrich IP addresses with geolocation",
            "Add business context to technical data"
        ],
        examples: [
            "lookup user_info username OUTPUT department, location",
            "lookup geoip ip OUTPUT city, country",
            "lookup error_codes code AS error_code OUTPUT description",
            "lookup asset_inventory host OUTPUT owner, criticality"
        ]
    },
    {
        name: "rename",
        category: "field",
        description: "Renames fields in search results. Useful for creating more readable field names.",
        formula: "rename <old-field> AS <new-field> [, <old-field> AS <new-field>]...",
        usage: [
            "Create more descriptive field names",
            "Standardize field naming",
            "Prepare data for visualization",
            "Make reports more user-friendly"
        ],
        examples: [
            "rename src_ip AS \"Source IP\"",
            "rename count AS \"Total Events\"",
            "rename user AS username, dept AS department",
            "rename response_time AS \"Response Time (ms)\""
        ]
    },
    {
        name: "bucket",
        category: "time",
        description: "Groups events into time buckets or numerical ranges. Also known as bin command.",
        formula: "bucket [span=<time>|<number>] <field>",
        usage: [
            "Create time-based groupings",
            "Group numerical values into ranges",
            "Prepare data for charting",
            "Aggregate data by intervals"
        ],
        examples: [
            "bucket _time span=1h",
            "bucket response_time span=100",
            "bucket bytes span=1MB",
            "bucket age span=10"
        ]
    },
    {
        name: "head",
        category: "transforming",
        description: "Returns the first N results from the search. Useful for limiting output.",
        formula: "head [<number>]",
        usage: [
            "Limit number of results",
            "Get sample data",
            "Preview search results",
            "Improve search performance"
        ],
        examples: [
            "head 10",
            "head 100",
            "head 1",
            "head 50"
        ]
    },
    {
        name: "tail",
        category: "transforming",
        description: "Returns the last N results from the search. Opposite of head command.",
        formula: "tail [<number>]",
        usage: [
            "Get most recent events",
            "View latest results",
            "Sample end of dataset",
            "Check final results"
        ],
        examples: [
            "tail 10",
            "tail 100",
            "tail 1",
            "tail 25"
        ]
    },
    {
        name: "append",
        category: "transforming",
        description: "Appends results from a subsearch to current results. Combines two result sets.",
        formula: "append [subsearch]",
        usage: [
            "Combine results from multiple searches",
            "Add historical data to current results",
            "Merge different data sources",
            "Create comprehensive reports"
        ],
        examples: [
            "append [search index=archive]",
            "append [search sourcetype=backup earliest=-7d]",
            "append [search index=secondary host=server2]",
            "append maxtime=60 [search index=logs error]"
        ]
    },
    {
        name: "appendcols",
        category: "transforming",
        description: "Appends fields from subsearch results as columns. Adds fields side-by-side.",
        formula: "appendcols [subsearch]",
        usage: [
            "Add calculated fields from another search",
            "Combine metrics from different sources",
            "Enrich results with additional data",
            "Create side-by-side comparisons"
        ],
        examples: [
            "appendcols [search index=metrics | stats avg(cpu)]",
            "appendcols [search sourcetype=inventory | table asset_id, owner]",
            "appendcols [search index=users | fields user, department]",
            "appendcols override=true [search index=reference]"
        ]
    },
    {
        name: "eventstats",
        category: "statistical",
        description: "Adds statistical aggregations as fields to each event without removing the events.",
        formula: "eventstats <function>(<field>) [by <field-list>]",
        usage: [
            "Add aggregate statistics to individual events",
            "Calculate running totals",
            "Compare individual values to group statistics",
            "Enrich events with contextual metrics"
        ],
        examples: [
            "eventstats avg(response_time) as avg_response",
            "eventstats count by host",
            "eventstats sum(bytes) as total_bytes by user",
            "eventstats max(cpu) as peak_cpu by server"
        ]
    },
    {
        name: "streamstats",
        category: "statistical",
        description: "Calculates cumulative statistics as events stream through. Maintains running calculations.",
        formula: "streamstats <function>(<field>) [by <field-list>] [window=<number>]",
        usage: [
            "Calculate running totals",
            "Track cumulative metrics",
            "Compute moving averages",
            "Detect trends in real-time"
        ],
        examples: [
            "streamstats count",
            "streamstats sum(sales) as running_total",
            "streamstats avg(response_time) window=10",
            "streamstats current=f last(status) as previous_status"
        ]
    },
    {
        name: "tstats",
        category: "statistical",
        description: "Performs statistical queries on indexed fields using tsidx files. Extremely fast for large datasets.",
        formula: "tstats <function>(<field>) [WHERE <constraints>] [BY <field-list>]",
        usage: [
            "Fast statistics on indexed fields",
            "Query large time ranges efficiently",
            "Analyze metrics and data models",
            "Generate high-performance reports"
        ],
        examples: [
            "tstats count WHERE index=main BY host",
            "tstats sum(bytes) WHERE sourcetype=access_* BY src_ip",
            "tstats avg(response_time) BY host, status",
            "tstats latest(_time) as last_seen BY user"
        ]
    },
    {
        name: "return",
        category: "search",
        description: "Returns values from a subsearch to the outer search. Used for dynamic value passing.",
        formula: "return [<count>] [<field>]",
        usage: [
            "Pass values from subsearch to main search",
            "Create dynamic search criteria",
            "Return calculated values",
            "Build flexible search queries"
        ],
        examples: [
            "return $user",
            "return 10 $ip_address",
            "return $threshold",
            "return 1 $latest_timestamp"
        ]
    },
    {
        name: "inputlookup",
        category: "search",
        description: "Loads data from a lookup table as search results. Treats lookup as data source.",
        formula: "inputlookup <lookup-table> [WHERE <conditions>]",
        usage: [
            "Load reference data",
            "Use lookup tables as data sources",
            "Import external data",
            "Initialize searches with static data"
        ],
        examples: [
            "inputlookup user_list.csv",
            "inputlookup geoip WHERE country=\"USA\"",
            "inputlookup asset_inventory.csv",
            "inputlookup threat_intel | fields ip, threat_level"
        ]
    },
    {
        name: "outputlookup",
        category: "transforming",
        description: "Writes search results to a lookup table file. Creates or updates lookup data.",
        formula: "outputlookup [create_empty=<bool>] [override_if_empty=<bool>] <lookup-table>",
        usage: [
            "Save search results as lookup",
            "Update reference data",
            "Create dynamic lookups",
            "Export data for reuse"
        ],
        examples: [
            "outputlookup user_activity.csv",
            "outputlookup create_empty=false threat_list.csv",
            "outputlookup override_if_empty=false inventory.csv",
            "outputlookup append=true historical_data.csv"
        ]
    },
    {
        name: "fillnull",
        category: "field",
        description: "Replaces null values in fields with specified values. Handles missing data.",
        formula: "fillnull [value=<string>] [<field-list>]",
        usage: [
            "Replace missing values",
            "Handle null fields",
            "Provide default values",
            "Clean data for calculations"
        ],
        examples: [
            "fillnull value=0",
            "fillnull value=\"Unknown\" user, department",
            "fillnull value=\"N/A\" status",
            "fillnull value=0 bytes, packets"
        ]
    },
    {
        name: "makemv",
        category: "field",
        description: "Converts a single-value field into a multi-value field by splitting on a delimiter.",
        formula: "makemv [delim=<string>] [tokenizer=<string>] <field>",
        usage: [
            "Split delimited values into multiple values",
            "Parse comma-separated lists",
            "Create multi-value fields",
            "Process structured text data"
        ],
        examples: [
            "makemv delim=\",\" tags",
            "makemv tokenizer=\"(\\w+)\" keywords",
            "makemv delim=\";\" email_list",
            "makemv delim=\"|\" categories"
        ]
    },
    {
        name: "mvexpand",
        category: "transforming",
        description: "Expands multi-value fields into separate events, one for each value.",
        formula: "mvexpand <field> [limit=<number>]",
        usage: [
            "Convert multi-value fields to separate events",
            "Analyze individual values in multi-value fields",
            "Normalize data structure",
            "Process arrays and lists"
        ],
        examples: [
            "mvexpand tags",
            "mvexpand email limit=10",
            "mvexpand ip_addresses",
            "mvexpand categories"
        ]
    },
    {
        name: "regex",
        category: "search",
        description: "Filters results based on regular expression pattern matching. Alternative to rex for filtering.",
        formula: "regex [<field>=]<regex-pattern>",
        usage: [
            "Filter using complex patterns",
            "Match specific formats",
            "Validate field values",
            "Apply pattern-based filtering"
        ],
        examples: [
            "regex user=\"^admin.*\"",
            "regex _raw=\"ERROR|FATAL\"",
            "regex ip=\"^192\\.168\\.\"",
            "regex email=\".*@company\\.com$\""
        ]
    },
    {
        name: "replace",
        category: "field",
        description: "Replaces values in fields based on pattern matching. Updates field values.",
        formula: "replace <pattern> WITH <replacement> IN <field>",
        usage: [
            "Update field values",
            "Standardize data",
            "Clean and normalize values",
            "Apply transformations"
        ],
        examples: [
            "replace 0 WITH \"Success\" IN status",
            "replace \"*ERROR*\" WITH \"Error\" IN message",
            "replace \"localhost\" WITH \"127.0.0.1\" IN host",
            "replace \"N/A\" WITH \"Unknown\" IN department"
        ]
    },
    {
        name: "convert",
        category: "field",
        description: "Converts field values to different formats (e.g., time formats, number formats).",
        formula: "convert <function>(<field>) [AS <new-field>]",
        usage: [
            "Convert time formats",
            "Format numbers",
            "Convert data types",
            "Apply standard conversions"
        ],
        examples: [
            "convert ctime(_time) AS readable_time",
            "convert dur2sec(duration) AS seconds",
            "convert memk(bytes) AS kilobytes",
            "convert num(string_value) AS numeric_value"
        ]
    },
    {
        name: "foreach",
        category: "transforming",
        description: "Iterates over multiple fields and applies eval expressions to each.",
        formula: "foreach <field-pattern> [eval <expression>]",
        usage: [
            "Apply operations to multiple fields",
            "Batch process field values",
            "Transform groups of fields",
            "Perform bulk calculations"
        ],
        examples: [
            "foreach cpu* [eval <<FIELD>>=round(<<FIELD>>,2)]",
            "foreach bytes_* [eval <<FIELD>>=<<FIELD>>/1024]",
            "foreach count_* [eval total=total+<<FIELD>>]",
            "foreach metric_* [eval <<FIELD>>=if(<<FIELD>>=\"\",0,<<FIELD>>)]"
        ]
    },
    {
        name: "accum",
        category: "statistical",
        description: "Calculates cumulative sum of a field. Keeps running total.",
        formula: "accum <field> [AS <new-field>]",
        usage: [
            "Calculate running totals",
            "Track cumulative values",
            "Generate progressive sums",
            "Monitor accumulation over time"
        ],
        examples: [
            "accum count AS total_count",
            "accum sales AS cumulative_sales",
            "accum errors",
            "accum bytes AS total_bytes"
        ]
    },
    {
        name: "delta",
        category: "statistical",
        description: "Calculates the difference between consecutive events for a field.",
        formula: "delta <field> [AS <new-field>] [p=<number>]",
        usage: [
            "Calculate change between events",
            "Track deltas over time",
            "Measure incremental changes",
            "Detect rate of change"
        ],
        examples: [
            "delta count AS change",
            "delta bytes AS bytes_diff",
            "delta temperature p=2",
            "delta value AS delta_value"
        ]
    },
    {
        name: "autoregress",
        category: "statistical",
        description: "Adds previous values of a field as new fields. Useful for time-series analysis.",
        formula: "autoregress <field> [AS <new-field>] [p=<number>]",
        usage: [
            "Compare current value with previous values",
            "Analyze time-series patterns",
            "Detect trends and changes",
            "Perform lag analysis"
        ],
        examples: [
            "autoregress cpu_usage AS previous_cpu p=1",
            "autoregress count p=3",
            "autoregress temperature AS prev_temp",
            "autoregress sales p=7"
        ]
    },
    {
        name: "predict",
        category: "statistical",
        description: "Predicts future values using various algorithms. Forecasting command.",
        formula: "predict <field> [AS <new-field>] [future_timespan=<number>] [algorithm=<algorithm>]",
        usage: [
            "Forecast future values",
            "Predict trends",
            "Generate projections",
            "Perform predictive analysis"
        ],
        examples: [
            "predict count future_timespan=10",
            "predict sales AS predicted_sales algorithm=LLP5",
            "predict cpu_usage future_timespan=24",
            "predict errors algorithm=LL"
        ]
    },
    {
        name: "anomalies",
        category: "statistical",
        description: "Detects anomalies in time-series data using statistical methods.",
        formula: "anomalies <field> [action=<action>]",
        usage: [
            "Detect unusual patterns",
            "Identify outliers",
            "Find anomalous behavior",
            "Alert on deviations"
        ],
        examples: [
            "anomalies response_time",
            "anomalies count action=filter",
            "anomalies cpu_usage action=annotate",
            "anomalies bytes"
        ]
    },
    {
        name: "cluster",
        category: "transforming",
        description: "Groups similar events together based on text similarity. Useful for log analysis.",
        formula: "cluster [field=<field>] [t=<threshold>] [showcount=<bool>]",
        usage: [
            "Group similar log messages",
            "Find patterns in unstructured data",
            "Categorize events automatically",
            "Reduce noise in logs"
        ],
        examples: [
            "cluster showcount=true",
            "cluster field=message t=0.8",
            "cluster field=_raw showcount=true",
            "cluster t=0.9"
        ]
    },
    {
        name: "contingency",
        category: "statistical",
        description: "Builds a contingency table showing the co-occurrence of two categorical fields.",
        formula: "contingency <row-field> <column-field>",
        usage: [
            "Analyze relationships between categorical variables",
            "Create cross-tabulation",
            "Study field correlations",
            "Generate pivot-like views"
        ],
        examples: [
            "contingency status host",
            "contingency user action",
            "contingency source sourcetype",
            "contingency country product"
        ]
    },
    {
        name: "correlate",
        category: "statistical",
        description: "Calculates correlation between fields. Measures statistical relationships.",
        formula: "correlate <field-list>",
        usage: [
            "Find correlations between metrics",
            "Analyze relationships",
            "Identify dependencies",
            "Perform correlation analysis"
        ],
        examples: [
            "correlate cpu_usage memory_usage",
            "correlate response_time error_count",
            "correlate sales marketing_spend",
            "correlate temperature humidity"
        ]
    },
    {
        name: "geostats",
        category: "statistical",
        description: "Generates statistics for geographic visualization. Creates map-ready data.",
        formula: "geostats [latfield=<field>] [longfield=<field>] <function>(<field>)",
        usage: [
            "Prepare data for map visualizations",
            "Aggregate by geographic location",
            "Create heatmaps",
            "Analyze geographic distribution"
        ],
        examples: [
            "geostats latfield=lat longfield=lon count",
            "geostats count by country",
            "geostats sum(sales) latfield=latitude longfield=longitude",
            "geostats avg(response_time)"
        ]
    },
    {
        name: "map",
        category: "transforming",
        description: "Executes a search for each result, passing field values as arguments.",
        formula: "map [maxsearches=<number>] [search=<string>]",
        usage: [
            "Run dynamic searches based on results",
            "Perform iterative searches",
            "Execute parameterized queries",
            "Chain dependent searches"
        ],
        examples: [
            "map search=\"search host=$host$ error\"",
            "map maxsearches=10 search=\"search index=main user=$user$\"",
            "map search=\"search sourcetype=$sourcetype$ | stats count\"",
            "map search=\"search ip=$ip$ | table _time, action\""
        ]
    },
    {
        name: "metadata",
        category: "search",
        description: "Returns metadata information about indexes, sources, sourcetypes, and hosts.",
        formula: "metadata type=<type> [index=<index>]",
        usage: [
            "Get index information",
            "Find available sources",
            "List sourcetypes",
            "Discover data inventory"
        ],
        examples: [
            "metadata type=hosts index=main",
            "metadata type=sources",
            "metadata type=sourcetypes index=*",
            "metadata type=hosts | stats count"
        ]
    },
    {
        name: "multisearch",
        category: "search",
        description: "Runs multiple independent searches in parallel and combines results.",
        formula: "multisearch [search1] [search2] ...",
        usage: [
            "Combine results from multiple searches",
            "Search across different indexes simultaneously",
            "Merge diverse data sources",
            "Parallelize search execution"
        ],
        examples: [
            "multisearch [search index=web] [search index=app]",
            "multisearch [search sourcetype=access_*] [search sourcetype=error_*]",
            "multisearch [search host=server1] [search host=server2]",
            "multisearch [search index=prod] [search index=dev]"
        ]
    },
    {
        name: "sendemail",
        category: "transforming",
        description: "Sends search results via email. Used for alerting and reporting.",
        formula: "sendemail to=<email> [subject=<string>] [message=<string>]",
        usage: [
            "Send alert emails",
            "Distribute reports",
            "Notify stakeholders",
            "Automate email notifications"
        ],
        examples: [
            "sendemail to=\"admin@company.com\" subject=\"Alert\"",
            "sendemail to=\"team@company.com\" message=\"Daily Report\"",
            "sendemail to=\"ops@company.com\" subject=\"Error Summary\"",
            "sendemail to=\"security@company.com\" priority=high"
        ]
    }
];
