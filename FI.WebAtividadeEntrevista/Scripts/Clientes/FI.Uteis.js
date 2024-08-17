
function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(texto);
    $('#' + random).modal('show');
}


function ValidarCPF(Objcpf) {

    var cpf = $.trim(Objcpf);

    cpf = cpf.replace('.', '');
    cpf = cpf.replace('.', '');
    cpf = cpf.replace('-', '');
    exp = /\.|\-/g;
    cpf = cpf.toString().replace(exp, "");

    while (cpf.length < 11) cpf = "0" + cpf;
    var expReg = /^0+$|^1+$|^2+$|^3+$|^4+$|^5+$|^6+$|^7+$|^8+$|^9+$/;
    var a = [];
    var b = new Number;
    var c = 11;
    for (i = 0; i < 11; i++) {
        a[i] = cpf.charAt(i);
        if (i < 9) b += (a[i] * --c);
    }
    if ((x = b % 11) < 2) {
        a[9] = 0;
    }
    else {
        a[9] = 11 - x;
    }
    b = 0;
    c = 11;
    for (y = 0; y < 10; y++)
        b += (a[y] * c--);
    if ((x = b % 11) < 2) {
        a[10] = 0;
    }
    else {
        a[10] = 11 - x;
    }

    var retorno = true;

    if ((cpf.charAt(9) != '' + a[9]) || (cpf.charAt(10) != '' + a[10]) || cpf.match(expReg))
        retorno = false;

    return retorno;
}


function checkarCpfTabela(cpf) {
    var cpfExists = false;
    $('#beneficiariosTable tbody tr').each(function () {
        var rowCpf = $(this).find('td').first().text();
        if (rowCpf === cpf) {
            cpfExists = true;
            return false;
        }
    });
    return cpfExists;
}

function getBeneficiariosData() {
    var beneficiarios = [];

    $('#beneficiariosTable tbody tr').each(function () {
        var id = $(this).find('input[type="hidden"]').val();
        var cpf = $(this).find('td').eq(0).text().trim();
        var nome = $(this).find('td').eq(1).text().trim();
        if (cpf && nome) {
            beneficiarios.push({ Id: id, CPF: cpf.replace('.', '').replace('-', '').replace('.', ''), Nome: nome });
        }
    });
    return beneficiarios;
}


function checkarCpfTabela(cpf) {
    var cpfExists = false;
    $('#beneficiariosTable tbody tr').each(function () {
        var rowCpf = $(this).find('td').first().text();
        if (rowCpf === cpf) {
            cpfExists = true;
            return false;
        }
    });
    return cpfExists;
}

function popularBeneficiariosTable(beneficiarios) {
    var table = $('#beneficiariosTable tbody');
    table.empty();

    beneficiarios.forEach(function (beneficiario) {
        var row = $('<tr>').append(
            $('<td>').text(beneficiario.CPF),
            $('<td>').text(beneficiario.Nome),
            $('<td>').append(
                $('<button>').addClass('btn btn-warning btn-sm').text('Editar').click(function () {
                    $('#beneficiarioCPF').val(beneficiario.CPF);
                    $('#beneficiarioNome').val(beneficiario.Nome);
                    $('#beneficiarioId').val(beneficiario.Id);
                    $(this).closest('tr').remove();
                }),
                $('<button>').addClass('btn btn-danger btn-sm').text('Excluir').click(function () {
                    $(this).closest('tr').remove();
                })
            ),
            $('<td>').append(
                $('<input>').attr('type', 'hidden').attr('name', 'beneficiarioId').val(beneficiario.Id)
            )
        );

        table.append(row);
    });
}