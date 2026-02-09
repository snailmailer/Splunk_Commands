# Splunk Commands Reference Guide

A comprehensive reference guide for Splunk SPL (Search Processing Language) commands with detailed descriptions, formulas, usage scenarios, and practical examples.

## 📚 Table of Contents

- [Search Commands](#search-commands)
- [Statistical Commands](#statistical-commands)
- [Reporting Commands](#reporting-commands)
- [Transforming Commands](#transforming-commands)
- [Field Extraction Commands](#field-extraction-commands)
- [Time-Based Commands](#time-based-commands)
- [Interactive Web Application](#interactive-web-application)

---

## Search Commands

Commands used to search, filter, and retrieve data from Splunk indexes.

| Command | Description | Formula | Example |
|---------|-------------|---------|---------|
| **search** | The foundation of all Splunk queries. Searches through indexed data to find events matching specified criteria. | `search <search-criteria>` | `search error`<br>`search sourcetype=access_* status=404`<br>`search host=webserver* AND (error OR warning)` |
| **where** | Filters results using eval expressions. More flexible than search for complex conditions. | `where <eval-expression>` | `where response_time > 1000`<br>`where status!=200 AND status!=201`<br>`where isnotnull(error_message)` |
| **regex** | Filters results based on regular expression pattern matching. | `regex [<field>=]<regex-pattern>` | `regex user="^admin.*"`<br>`regex _raw="ERROR\|FATAL"`<br>`regex ip="^192\\.168\\."` |
| **return** | Returns values from a subsearch to the outer search. | `return [<count>] [<field>]` | `return $user`<br>`return 10 $ip_address`<br>`return $threshold` |
| **inputlookup** | Loads data from a lookup table as search results. | `inputlookup <lookup-table> [WHERE <conditions>]` | `inputlookup user_list.csv`<br>`inputlookup geoip WHERE country="USA"`<br>`inputlookup asset_inventory.csv` |
| **metadata** | Returns metadata information about indexes, sources, sourcetypes, and hosts. | `metadata type=<type> [index=<index>]` | `metadata type=hosts index=main`<br>`metadata type=sources`<br>`metadata type=sourcetypes index=*` |
| **multisearch** | Runs multiple independent searches in parallel and combines results. | `multisearch [search1] [search2] ...` | `multisearch [search index=web] [search index=app]`<br>`multisearch [search sourcetype=access_*] [search sourcetype=error_*]` |

### Search Commands - Usage Scenarios

**search**
- Find events containing specific keywords
- Filter data based on field values
- Narrow down results using boolean operators (AND, OR, NOT)
- Use wildcards for pattern matching

**where**
- Filter using calculated fields
- Apply complex boolean logic
- Use functions in filter conditions
- Filter based on mathematical comparisons

**regex**
- Filter using complex patterns
- Match specific formats
- Validate field values
- Apply pattern-based filtering

---

## Statistical Commands

Commands for calculating statistics, aggregations, and performing data analysis.

| Command | Description | Formula | Example |
|---------|-------------|---------|---------|
| **stats** | Calculates aggregate statistics over the result set. | `stats <function>(<field>) [by <field-list>]` | `stats count by status`<br>`stats avg(response_time) by host`<br>`stats sum(bytes) as total_bytes by user` |
| **top** | Returns the most common values for specified fields with count and percentage. | `top [<limit>] <field-list> [by <field>]` | `top user`<br>`top 20 src_ip`<br>`top status by host` |
| **rare** | Returns the least common values for specified fields. | `rare [<limit>] <field-list> [by <field>]` | `rare user`<br>`rare 10 error_code`<br>`rare status by sourcetype` |
| **eventstats** | Adds statistical aggregations as fields to each event without removing the events. | `eventstats <function>(<field>) [by <field-list>]` | `eventstats avg(response_time) as avg_response`<br>`eventstats count by host`<br>`eventstats sum(bytes) as total_bytes by user` |
| **streamstats** | Calculates cumulative statistics as events stream through. | `streamstats <function>(<field>) [by <field-list>] [window=<number>]` | `streamstats count`<br>`streamstats sum(sales) as running_total`<br>`streamstats avg(response_time) window=10` |
| **tstats** | Performs statistical queries on indexed fields using tsidx files. Extremely fast. | `tstats <function>(<field>) [WHERE <constraints>] [BY <field-list>]` | `tstats count WHERE index=main BY host`<br>`tstats sum(bytes) WHERE sourcetype=access_* BY src_ip` |
| **accum** | Calculates cumulative sum of a field. | `accum <field> [AS <new-field>]` | `accum count AS total_count`<br>`accum sales AS cumulative_sales`<br>`accum errors` |
| **delta** | Calculates the difference between consecutive events for a field. | `delta <field> [AS <new-field>] [p=<number>]` | `delta count AS change`<br>`delta bytes AS bytes_diff`<br>`delta temperature p=2` |
| **autoregress** | Adds previous values of a field as new fields. | `autoregress <field> [AS <new-field>] [p=<number>]` | `autoregress cpu_usage AS previous_cpu p=1`<br>`autoregress count p=3`<br>`autoregress temperature AS prev_temp` |
| **predict** | Predicts future values using various algorithms. | `predict <field> [AS <new-field>] [future_timespan=<number>] [algorithm=<algorithm>]` | `predict count future_timespan=10`<br>`predict sales AS predicted_sales algorithm=LLP5` |
| **anomalies** | Detects anomalies in time-series data using statistical methods. | `anomalies <field> [action=<action>]` | `anomalies response_time`<br>`anomalies count action=filter`<br>`anomalies cpu_usage action=annotate` |
| **contingency** | Builds a contingency table showing co-occurrence of two categorical fields. | `contingency <row-field> <column-field>` | `contingency status host`<br>`contingency user action`<br>`contingency source sourcetype` |
| **correlate** | Calculates correlation between fields. | `correlate <field-list>` | `correlate cpu_usage memory_usage`<br>`correlate response_time error_count`<br>`correlate sales marketing_spend` |
| **geostats** | Generates statistics for geographic visualization. | `geostats [latfield=<field>] [longfield=<field>] <function>(<field>)` | `geostats latfield=lat longfield=lon count`<br>`geostats count by country`<br>`geostats sum(sales) latfield=latitude longfield=longitude` |

### Statistical Commands - Usage Scenarios

**stats**
- Calculate count, sum, average, min, max of field values
- Group results by one or more fields
- Create statistical summaries of your data
- Generate metrics for dashboards and reports

**eventstats**
- Add aggregate statistics to individual events
- Calculate running totals
- Compare individual values to group statistics
- Enrich events with contextual metrics

**tstats**
- Fast statistics on indexed fields
- Query large time ranges efficiently
- Analyze metrics and data models
- Generate high-performance reports

---

## Reporting Commands

Commands for creating tables, charts, and visualizations.

| Command | Description | Formula | Example |
|---------|-------------|---------|---------|
| **table** | Displays results in a tabular format with specified fields as columns. | `table <field-list>` | `table _time, host, source, message`<br>`table user, action, status, ip_address`<br>`table timestamp, error_code, description` |
| **chart** | Creates charts and visualizations by computing statistics over time or other dimensions. | `chart <function>(<field>) [over <row-split>] [by <column-split>]` | `chart count over _time by status`<br>`chart avg(response_time) over host`<br>`chart sum(sales) over region by product` |
| **timechart** | Creates time-based charts with automatic time bucketing. | `timechart [span=<time>] <function>(<field>) [by <field>]` | `timechart span=1h count by sourcetype`<br>`timechart avg(response_time)`<br>`timechart span=5m sum(errors) by host` |

### Reporting Commands - Usage Scenarios

**table**
- Display specific fields in a clean table format
- Organize data for easy reading
- Select only relevant columns from search results
- Present data in reports and dashboards

**chart**
- Create time-series visualizations
- Generate multi-series charts
- Compare metrics across different dimensions
- Build interactive dashboards

**timechart**
- Visualize trends over time
- Monitor metrics with time-based granularity
- Compare multiple series over time
- Detect patterns and anomalies in time-series data

---

## Transforming Commands

Commands that transform, manipulate, and restructure data.

| Command | Description | Formula | Example |
|---------|-------------|---------|---------|
| **dedup** | Removes duplicate events based on specified fields. | `dedup [<number>] <field-list> [keepempty=<bool>] [consecutive=<bool>]` | `dedup user`<br>`dedup host, source`<br>`dedup 3 ip_address` |
| **sort** | Sorts search results by specified fields. | `sort [<limit>] [+\|-] <field-list>` | `sort -_time`<br>`sort +status, -response_time`<br>`sort 10 -count` |
| **transaction** | Groups events into transactions based on constraints. | `transaction <field-list> [maxspan=<time>] [maxpause=<time>] [startswith=<pattern>] [endswith=<pattern>]` | `transaction session_id maxspan=30m`<br>`transaction user startswith="login" endswith="logout"`<br>`transaction request_id maxpause=5s` |
| **join** | Combines results from two searches based on common fields. | `join [type=inner\|left\|outer] <field-list> [subsearch]` | `join user [search index=users \| fields user, department]`<br>`join type=left ip [search index=threats \| fields ip, threat_level]` |
| **append** | Appends results from a subsearch to current results. | `append [subsearch]` | `append [search index=archive]`<br>`append [search sourcetype=backup earliest=-7d]`<br>`append [search index=secondary host=server2]` |
| **appendcols** | Appends fields from subsearch results as columns. | `appendcols [subsearch]` | `appendcols [search index=metrics \| stats avg(cpu)]`<br>`appendcols [search sourcetype=inventory \| table asset_id, owner]` |
| **mvexpand** | Expands multi-value fields into separate events. | `mvexpand <field> [limit=<number>]` | `mvexpand tags`<br>`mvexpand email limit=10`<br>`mvexpand ip_addresses` |
| **outputlookup** | Writes search results to a lookup table file. | `outputlookup [create_empty=<bool>] [override_if_empty=<bool>] <lookup-table>` | `outputlookup user_activity.csv`<br>`outputlookup create_empty=false threat_list.csv` |
| **cluster** | Groups similar events together based on text similarity. | `cluster [field=<field>] [t=<threshold>] [showcount=<bool>]` | `cluster showcount=true`<br>`cluster field=message t=0.8`<br>`cluster field=_raw showcount=true` |
| **map** | Executes a search for each result, passing field values as arguments. | `map [maxsearches=<number>] [search=<string>]` | `map search="search host=$host$ error"`<br>`map maxsearches=10 search="search index=main user=$user$"` |
| **foreach** | Iterates over multiple fields and applies eval expressions. | `foreach <field-pattern> [eval <expression>]` | `foreach cpu* [eval <<FIELD>>=round(<<FIELD>>,2)]`<br>`foreach bytes_* [eval <<FIELD>>=<<FIELD>>/1024]` |
| **head** | Returns the first N results from the search. | `head [<number>]` | `head 10`<br>`head 100`<br>`head 1` |
| **tail** | Returns the last N results from the search. | `tail [<number>]` | `tail 10`<br>`tail 100`<br>`tail 25` |
| **sendemail** | Sends search results via email. | `sendemail to=<email> [subject=<string>] [message=<string>]` | `sendemail to="admin@company.com" subject="Alert"`<br>`sendemail to="team@company.com" message="Daily Report"` |

### Transforming Commands - Usage Scenarios

**dedup**
- Remove duplicate entries
- Get unique values
- Keep first N occurrences
- Clean up redundant data

**transaction**
- Group related events together
- Track user sessions
- Analyze multi-step processes
- Calculate transaction duration

**join**
- Combine data from different sources
- Enrich events with additional information
- Correlate related datasets
- Perform lookups across indexes

---

## Field Extraction Commands

Commands for creating, modifying, and extracting fields from events.

| Command | Description | Formula | Example |
|---------|-------------|---------|---------|
| **eval** | Creates or modifies fields using expressions and functions. | `eval <field>=<expression>` | `eval duration=end_time-start_time`<br>`eval status_label=if(status=200,"OK","Error")`<br>`eval GB=bytes/1024/1024/1024` |
| **rex** | Extracts fields using regular expressions. | `rex [field=<field>] "<regex-with-named-groups>"` | `rex field=_raw "user=(?<username>\\w+)"`<br>`rex "(?<ip>\\d+\\.\\d+\\.\\d+\\.\\d+)"`<br>`rex field=message "error code: (?<error_code>\\d+)"` |
| **fields** | Includes or excludes fields from search results. | `fields [+\|-] <field-list>` | `fields host, source, _time`<br>`fields - _raw, _cd`<br>`fields + user, action, status` |
| **lookup** | Enriches events with data from lookup tables. | `lookup <lookup-table> <lookup-field> [AS <event-field>] [OUTPUT <field-list>]` | `lookup user_info username OUTPUT department, location`<br>`lookup geoip ip OUTPUT city, country`<br>`lookup error_codes code AS error_code OUTPUT description` |
| **rename** | Renames fields in search results. | `rename <old-field> AS <new-field> [, <old-field> AS <new-field>]...` | `rename src_ip AS "Source IP"`<br>`rename count AS "Total Events"`<br>`rename user AS username, dept AS department` |
| **fillnull** | Replaces null values in fields with specified values. | `fillnull [value=<string>] [<field-list>]` | `fillnull value=0`<br>`fillnull value="Unknown" user, department`<br>`fillnull value="N/A" status` |
| **makemv** | Converts a single-value field into a multi-value field. | `makemv [delim=<string>] [tokenizer=<string>] <field>` | `makemv delim="," tags`<br>`makemv tokenizer="(\\w+)" keywords`<br>`makemv delim=";" email_list` |
| **replace** | Replaces values in fields based on pattern matching. | `replace <pattern> WITH <replacement> IN <field>` | `replace 0 WITH "Success" IN status`<br>`replace "*ERROR*" WITH "Error" IN message`<br>`replace "localhost" WITH "127.0.0.1" IN host` |
| **convert** | Converts field values to different formats. | `convert <function>(<field>) [AS <new-field>]` | `convert ctime(_time) AS readable_time`<br>`convert dur2sec(duration) AS seconds`<br>`convert memk(bytes) AS kilobytes` |

### Field Extraction Commands - Usage Scenarios

**eval**
- Create calculated fields
- Transform field values
- Perform mathematical operations
- Apply conditional logic with if/case statements

**rex**
- Extract data from raw text
- Parse log formats
- Create fields from patterns
- Clean and structure unstructured data

**lookup**
- Add contextual information to events
- Map codes to descriptions
- Enrich IP addresses with geolocation
- Add business context to technical data

---

## Time-Based Commands

Commands for working with time-series data and time bucketing.

| Command | Description | Formula | Example |
|---------|-------------|---------|---------|
| **timechart** | Creates time-based charts with automatic time bucketing. | `timechart [span=<time>] <function>(<field>) [by <field>]` | `timechart span=1h count by sourcetype`<br>`timechart avg(response_time)`<br>`timechart span=5m sum(errors) by host` |
| **bucket** | Groups events into time buckets or numerical ranges. | `bucket [span=<time>\|<number>] <field>` | `bucket _time span=1h`<br>`bucket response_time span=100`<br>`bucket bytes span=1MB` |

### Time-Based Commands - Usage Scenarios

**timechart**
- Visualize trends over time
- Monitor metrics with time-based granularity
- Compare multiple series over time
- Detect patterns and anomalies in time-series data

**bucket**
- Create time-based groupings
- Group numerical values into ranges
- Prepare data for charting
- Aggregate data by intervals

---

## Interactive Web Application

This repository also includes an interactive web application for browsing Splunk commands with:

- 🔍 **Real-time search** across all commands
- 🏷️ **Category filtering** (Search, Statistical, Reporting, Transforming, Field Extraction, Time-Based)
- 🎨 **Premium dark theme** with glassmorphism and smooth animations
- 📱 **Fully responsive design**

### Running the Web Application

1. Open `index.html` in your web browser
2. Browse commands by category or use the search feature
3. Click on any command card to view detailed information

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Resources

- [Splunk Documentation](https://docs.splunk.com/)
- [Splunk Search Reference](https://docs.splunk.com/Documentation/Splunk/latest/SearchReference)
- [Splunk SPL Guide](https://docs.splunk.com/Documentation/Splunk/latest/Search/GetstartedwithSearch)

---

**Created with ❤️ for the Splunk community**
