import React from 'react';

import { Loader } from './components/Loader';
import { SearchBar } from './components/SearchBar';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ErrorButton } from './components/ErrorButton';
import { CardList } from './components/CardList';
import { Character } from './types';
import { fetchCharacters } from './api';

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

    fetchCharacters(term)
      .then((results) => {
        this.setState({ data: results, loading: false });
      })
      .catch((err: Error) => {
        this.setState({ error: err.message, loading: false });
      });
  };

  render() {
    const { data, loading, error } = this.state;

    return (
      <ErrorBoundary>
        <main className="min-h-screen antialiased text-slate-400 bg-slate-900">
          <div className="max-w-4xl p-4 mx-auto">
            <SearchBar onSearch={this.fetchData} />
            {loading && (
              <div className="flex items-center justify-center w-full h-[50vh]">
                <Loader />
              </div>
            )}
            {error ? (
              <div className="py-4 text-rose-500">{error}</div>
            ) : (
              <CardList data={data} />
            )}
            <ErrorButton />
          </div>
        </main>
      </ErrorBoundary>
    );
  }
}
