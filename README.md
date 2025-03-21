# LedgerR Project Document

# Planned Features
- add expenses on a per-month basis
- add income on a per-month basis
- generate networth on a per-month basis => almost like a snap-shot on the first of every month
	- Aggregate of Monthly income - expenses + Chequing + Savings + TFSA + FHSA
- automatically determine value of TFSA and FHSA based on stocks held + stock ticker
- build Line chart for networth
- build bar chart for monthly spending aggregated on spending category
- add PDF parsing (using a locally hosted LLM) for spending

# Tasks

#### Build the Rust back end
- [ ] Pick out the schema for the DB
	- Transactions table
		`ID | description | date| type | category | amount`
	- Stocks Table
	- Accounts table (chequing, savings, TFSA, FHSA)
- [ ] Design the backend in Rust
	- add a transaction to the DB
	- view transactions in FE
	Design:
		- Models => should match the tables
		- Errors => they either kill the app or we communicate to React that the interaction was no possible
	Data base interaction layer:
		- Transforming data:
			- React => Rust Struct (Models)
			- Rust Struct => Sqlite Type
			- Sqlite Type => Rust Struct
			- Rust Struct => React
			- Filter data and return to React

#### Build the ui in react => use v0
- [ ] Mock UI https://v0.dev/chat/main-page-design-zQ0LCimdZio
- [ ] recreate Repo using React + vite

