import React from 'react';

import { Loader } from './components/Loader';
import { SearchBar } from './components/SearchBar';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ErrorButton } from './components/ErrorButton';
import { CardList } from './components/CardList';
import { Character } from './types';

interface AppState {
  data: Character[];
  loading: boolean;
  error: string | null;
}

export class App extends React.Component<object, AppState> {
  constructor(props: object) {
    super(props);
    this.state = {
      data: [],
      loading: false,
      error: null,
    };
  }

  componentDidMount() {
    const savedTerm = localStorage.getItem('searchTerm') || '';
    this.fetchData(savedTerm);
  }

  fetchData = (term: string) => {
    this.setState({ loading: true, error: null });

    fetch(`https://rickandmortyapi.com/api/character/?name=${term}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const json = await res.json();
        this.setState({ data: json.results, loading: false });
      })
      .catch((err: Error) => {
        this.setState({ error: err.message, loading: false });
      });
  };

  render() {
    const { data, loading, error } = this.state;
    console.log(data);

    return (
      <ErrorBoundary>
        <div className="max-w-4xl p-4 mx-auto">
          <SearchBar onSearch={this.fetchData} />
          {loading && <Loader />}
          {error ? (
            <div className="p-4 text-red-600">{error}</div>
          ) : (
            <CardList data={data} />
          )}
          <ErrorButton />
        </div>
      </ErrorBoundary>
    );
  }
}
