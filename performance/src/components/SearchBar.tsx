interface SearchBarProps {
	query: string;
	onChange: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ query, onChange }) => (
	<input
		name='search'
		type='text'
		value={query}
		onChange={(e) => onChange(e.target.value)}
		placeholder='Search by country name'
		className='p-2 text-white rounded bg-slate-700'
	/>
);

export default SearchBar;
