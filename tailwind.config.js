const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
        'node_modules/preline/dist/*.js',
    ],

    theme: {
        fontFamily: {
            sans: ["Poppins", "sans-serif"],
        },
        screens: {
            'max-sm': { max: '539px' },
            'max-md': { max: '719px' },
            'max-lg': { max: '959px' },
            'max-xl': { max: '1139px' },
            'max-2xl': { max: '1319px' },
        }
    },

    plugins: [],
});
