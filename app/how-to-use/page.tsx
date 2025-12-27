import Link from "next/link";

export default function HowToUsePage() {
  return (
    <main className="min-h-screen bg-black text-white px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-blue-400 hover:text-blue-300 mb-8 inline-block">
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-bold mb-8">How to Use Leafra</h1>

        <div className="space-y-8">
          <section className="bg-gray-900/50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">1. Create an Account</h2>
            <p className="text-gray-300 mb-4">
              Sign up using your email or social accounts (Google, GitHub, Discord) to get started with Leafra.
            </p>
          </section>

          <section className="bg-gray-900/50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">2. Upload Your PDF</h2>
            <p className="text-gray-300 mb-4">
              Create a new chat and upload your PDF document. Our system will process and analyze it automatically.
            </p>
            <ul className="text-gray-300 list-disc list-inside space-y-2">
              <li>Supported format: PDF (up to 8MB)</li>
              <li>Processing time: Usually 1-2 minutes</li>
              <li>Your documents are securely stored and processed</li>
            </ul>
          </section>

          <section className="bg-gray-900/50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">3. Ask Questions</h2>
            <p className="text-gray-300 mb-4">
              Start asking questions about your document. Our AI will provide accurate answers based on the PDF content.
            </p>
            <div className="bg-gray-800/50 p-4 rounded border-l-4 border-blue-400">
              <p className="text-sm text-gray-400 mb-2">Example questions:</p>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>"What are the main topics discussed in this document?"</li>
                <li>"Summarize the key findings from page 5"</li>
                <li>"Explain the methodology used in section 3"</li>
              </ul>
            </div>
          </section>

          <section className="bg-gray-900/50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">4. Manage Your Chats</h2>
            <p className="text-gray-300 mb-4">
              Access all your previous conversations from the dashboard. Each chat is associated with a specific document.
            </p>
          </section>

          <section className="bg-gray-900/50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">Tips for Best Results</h2>
            <ul className="text-gray-300 space-y-2">
              <li>Be specific in your questions for more accurate answers</li>
              <li>Upload clear, high-quality PDF documents</li>
              <li>Use the chat interface for follow-up questions</li>
              <li>Try different phrasings if you don't get the expected answer</li>
            </ul>
          </section>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/signin"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Get Started Now
          </Link>
        </div>
      </div>
    </main>
  );
}
