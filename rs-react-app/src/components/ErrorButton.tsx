import React from 'react';

export class ErrorButton extends React.Component {
  state = { throw: false };

  render() {
    if (this.state.throw) {
      throw new Error('Checking ErrorBoundary');
    }
    return (
      <button
        type="button"
        className="bg-rose-500 font-medium rounded-lg text-xl px-5 py-2.5 text-center flex items-center text-black hover:bg-rose-600 duration-500 cursor-pointer w-full justify-center"
        onClick={() => this.setState({ throw: true })}
      >
        Throw Error
      </button>
    );
  }
}
