class AvaliacaoFilterBuilder {
    constructor(query = {}) {
        this.query = query;
        this.filtros = {};
        this.sort = { createdAt: -1 }; // padrão: mais recentes primeiro
    }

    comOrdemNota() {
        if (this.query.ordenarPorNota) {
            const criterio = this.query.ordenarPorNota.toLowerCase();
            if (criterio === 'mais-relevantes') {
                this.sort = { nota: -1 };
            } else if (criterio === 'menos-relevantes') {
                this.sort = { nota: 1 };
            }
        }
        return this;
    }

    comNotaMinima() {
        if (this.query.notaMinima) {
            const nota = parseFloat(this.query.notaMinima);
            if (!isNaN(nota)) {
                this.filtros.nota = { ...this.filtros.nota, $gte: nota };
            }
        }
        return this;
    }

    comNotaMaxima() {
        if (this.query.notaMaxima) {
            const nota = parseFloat(this.query.notaMaxima);
            if (!isNaN(nota)) {
                this.filtros.nota = { ...this.filtros.nota, $lte: nota };
            }
        }
        return this;
    }

    build() {
        return {
            filtros: this.filtros,
            ordenacao: this.sort
        };
    }
}

export default AvaliacaoFilterBuilder;
