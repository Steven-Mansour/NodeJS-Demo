/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./**/*.{html,js}"],
    theme: {
        extend: {
            fontFamily: {
                poppins: ['Poppins']
            },
            gridTemplateColumns: {
                // Simple 20 column grid
                '22': 'repeat(22, minmax(0, 1fr))',

                // Complex site-specific column configuration
                'footer': '200px minmax(900px, 1fr) 100px',
            }
        },
    },
    plugins: [],
}