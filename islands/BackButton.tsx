export default function BackButton() {
    return (
      <button 
        onClick={() => globalThis.location.href = '/'} 
        class="px-6 py-2 bg-gray-500 text-black font-semibold rounded-lg hover:bg-gray-600 transition-colors"
      >
        Back
      </button>
    );
  }
