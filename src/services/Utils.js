export default {

    pathConcat(pathPieces) {

        return pathPieces.map((currentPiece, index) => {

            let reg = '\/+$';

            if (index > 0) {
                reg = '(^\/+|' + reg + ')';
            }

            return currentPiece.trim().replace(
                new RegExp(reg, "g"),
                ''
            );
            
        }).join('/');

    }

};
