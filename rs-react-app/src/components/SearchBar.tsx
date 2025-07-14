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
      <div className="flex gap-2 p-4">
        <input
          placeholder="Search..."
          name="search"
          className="w-full p-2 border"
          value={this.state.term}
          onChange={this.handleChange}
        />
        <button
          type="button"
          className="px-4 py-2 text-white bg-blue-500"
          onClick={this.handleSearch}
        >
          Search
        </button>
      </div>
    );
  }
}
