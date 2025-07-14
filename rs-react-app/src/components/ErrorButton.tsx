import React from 'react';

export class ErrorButton extends React.Component {
  throwError = () => {
    throw new Error('Check ErrorBoundary');
  };

  render() {
    return (
      <button
        type="button"
        className="p-2 m-4 text-white bg-red-500"
        onClick={this.throwError}
      >
        Error
      </button>
    );
  }
}
