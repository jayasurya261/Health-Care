import React from 'react'

const Loading = () => {
  return (
    <div>
    <button
  disabled=""
  class="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-full shadow-lg flex items-center transition duration-300 transform hover:scale-105 active:scale-95"
>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="animate-spin h-5 w-5 mr-3 text-white"
  >
    <circle
      stroke-width="4"
      stroke="currentColor"
      r="10"
      cy="12"
      cx="12"
      class="opacity-25"
    ></circle>
    <path
      d="M4 12a8 8 0 018-8v8H4z"
      fill="currentColor"
      class="opacity-75"
    ></path>
  </svg>
  Loading...
</button>
  </div>
  )
}

export default Loading
