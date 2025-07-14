import React from 'react';

interface SearchBarProps {
  onSearch: (term: string) => void;
}

interface SearchBarState {
  term: string;
}

export class SearchBar extends React.Component<SearchBarProps, SearchBarState> {
  constructor(props: SearchBarProps) {
    super(props);
    const savedTerm = localStorage.getItem('searchTerm') || '';
    this.state = { term: savedTerm };
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ term: e.target.value });
  };

  handleSearch = () => {
    const trimmed = this.state.term.trim();
    localStorage.setItem('searchTerm', trimmed);
    this.props.onSearch(trimmed);
  };

  render() {
    return (
      <div className="flex gap-2 py-4">
        <input
          placeholder="Search..."
          name="search"
          className="appearance-none outline-none w-full border-2 bg-transparent focus:border-amber-500 font-medium rounded-lg text-xl px-5 py-2.5 me-2 inline-flex items-center text-white duration-500 border-slate-400"
          value={this.state.term}
          onChange={this.handleChange}
        />
        <button
          type="button"
          className="bg-amber-600 font-medium rounded-lg text-xl px-5 py-2.5 text-center inline-flex items-center text-black hover:bg-amber-500 duration-500 cursor-pointer"
          onClick={this.handleSearch}
        >
          Search
        </button>
      </div>
    );
  }
}
