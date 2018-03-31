/**
 * Created by Liu.Jun on 2018/1/22.
 */

function trimWhitespace(str) {
    if (typeof str !== 'string') {
        return str;
    }
    return str.replace(/^[ \n\r\t\f]+/, '').replace(/[ \n\r\t\f]+$/, '');
}

function collapseWhitespaceAll(str) {
    // Non-breaking space is specifically handled inside the replacer function here:
    return str && str.replace(/[ \n\r\t\f\xA0]+/g, function(spaces) {
        return spaces === '\t' ? '\t' : spaces.replace(/(^|\xA0+)[^\xA0]+/g, '$1 ');
    });
}

function collapseWhitespace(str, options = {preserveLineBreaks : true}, trimLeft = true, trimRight = true, collapseAll = true) {
    var lineBreakBefore = '',
        lineBreakAfter = '';

    str = trimWhitespace(str)

    if (options.preserveLineBreaks) {
        str = str.replace(/^[ \n\r\t\f]*?[\n\r][ \n\r\t\f]*/, function() {
            lineBreakBefore = '\n';
            return '';
        }).replace(/[ \n\r\t\f]*?[\n\r][ \n\r\t\f]*$/, function() {
            lineBreakAfter = '\n';
            return '';
        });
    }

    if (trimLeft) {
        // Non-breaking space is specifically handled inside the replacer function here:
        str = str.replace(/^[ \n\r\t\f\xA0]+/, function(spaces) {
            var conservative = !lineBreakBefore && options.conservativeCollapse;
            if (conservative && spaces === '\t') {
                return '\t';
            }
            return spaces.replace(/^[^\xA0]+/, '').replace(/(\xA0+)[^\xA0]+/g, '$1 ') || (conservative ? ' ' : '');
        });
    }

    if (trimRight) {
        // Non-breaking space is specifically handled inside the replacer function here:
        str = str.replace(/[ \n\r\t\f\xA0]+$/, function(spaces) {
            var conservative = !lineBreakAfter && options.conservativeCollapse;
            if (conservative && spaces === '\t') {
                return '\t';
            }
            return spaces.replace(/[^\xA0]+(\xA0+)/g, ' $1').replace(/[^\xA0]+$/, '') || (conservative ? ' ' : '');
        });
    }

    if (collapseAll) {
        // strip non space whitespace then compress spaces to one
        str = collapseWhitespaceAll(str);
    }

    return lineBreakBefore + str + lineBreakAfter;
}

export default collapseWhitespace
