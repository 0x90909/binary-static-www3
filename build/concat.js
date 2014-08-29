module.exports = {
    all: {
        options: {
            separator: ';',
        },
        files: {
            'dist/js/lib.js': [
                'src/javascript/lib/jquery.js', 
                'src/javascript/lib/highstock/highstock.js', 
                'src/javascript/lib/moment/moment.js', 
                'src/javascript/lib/**/*.js'
             ],
            'dist/js/binary.js': [
                'src/javascript/binary/base/*.js',
                'src/javascript/binary/**/*.js'
            ]
        }
    }
};
