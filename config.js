var config = {
    channels:  [ 'emmass3531', 'itsmeganx', 'Lit_TTV', 'switchrl' ],
    duration: 600000,
    debug: true,
    admins: [ {name: 'switchrl', rule_ignore: true} ]
}

if(config.debug) {
    config.channels = [ 'switchrl' ]
}

module.exports.config = config;