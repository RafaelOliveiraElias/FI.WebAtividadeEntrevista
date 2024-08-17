using FI.AtividadeEntrevista.BLL;
using WebAtividadeEntrevista.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FI.AtividadeEntrevista.DML;
using System.Web.UI.WebControls;

namespace WebAtividadeEntrevista.Controllers
{
    public class ClienteController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }


        public ActionResult Incluir()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Incluir(ClienteModel model)
        {
            BoCliente bo = new BoCliente();
            BoBeneficiario bob = new BoBeneficiario();
            try
            {

                if (!this.ModelState.IsValid)
                {
                    List<string> erros = (from item in ModelState.Values
                                          from error in item.Errors
                                          select error.ErrorMessage).ToList();

                    Response.StatusCode = 400;
                    return Json(string.Join(Environment.NewLine, erros));
                }

                if (bo.VerificarExistencia(model.CPF))
                {
                    Response.StatusCode = 400;
                    return Json("Já existe um cliente com esse CPF.");
                }

                model.Id = bo.Incluir(new Cliente()
                {
                    CEP = model.CEP,
                    Cidade = model.Cidade,
                    Email = model.Email,
                    Estado = model.Estado,
                    Logradouro = model.Logradouro,
                    Nacionalidade = model.Nacionalidade,
                    Nome = model.Nome,
                    Sobrenome = model.Sobrenome,
                    Telefone = model.Telefone,
                    CPF = model.CPF
                });

                foreach (var item in model.BeneficiariosCliente)
                {
                    bob.Incluir(new Beneficiario()
                    {
                        Nome = item.Nome,
                        CPF = item.CPF,
                        IDCLIENTE = model.Id
                    });
                }


                return Json("Cadastro efetuado com sucesso");
            }
            catch (Exception e)
            {

                throw e;
            }
        }

        [HttpPost]
        public JsonResult Alterar(ClienteModel model)
        {
            BoCliente bo = new BoCliente();
            BoBeneficiario bob = new BoBeneficiario();

            if (!this.ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }

            if (bo.VerificarExistencia(model.CPF, model.Id))
            {
                Response.StatusCode = 400;
                return Json("Erro: Já existe um usuário com esse CPF.");
            }

            bo.Alterar(new Cliente()
            {
                Id = model.Id,
                CEP = model.CEP,
                Cidade = model.Cidade,
                Email = model.Email,
                Estado = model.Estado,
                Logradouro = model.Logradouro,
                Nacionalidade = model.Nacionalidade,
                Nome = model.Nome,
                Sobrenome = model.Sobrenome,
                Telefone = model.Telefone,
                CPF = model.CPF
            });

            List<Beneficiario> listaBeneficiarios = bob.Listar(model.Id);
            List<BeneficiarioModel> listaModal = new List<BeneficiarioModel>();

            if (listaBeneficiarios != null)
            {
                foreach (var item in listaBeneficiarios)
                {
                    listaModal.Add(new BeneficiarioModel(item.Id, item.CPF, item.Nome, item.IDCLIENTE));
                }
            }

            var beneficiariosRemovidos = listaModal.Where(b =>
                !model.BeneficiariosCliente.Any(mb => mb.Id == b.Id)).ToList();

            foreach (var beneficiarioRemovido in beneficiariosRemovidos)
            {
                bob.Excluir(beneficiarioRemovido.Id);
            }

            foreach (var item in model.BeneficiariosCliente)
            {
                if (item.Id == 0)
                {
                    bob.Incluir(new Beneficiario()
                    {
                        Nome = item.Nome,
                        CPF = item.CPF,
                        IDCLIENTE = model.Id
                    });
                }
                else
                {
                    bob.Alterar(new Beneficiario()
                    {
                        Id = item.Id,
                        Nome = item.Nome,
                        CPF = item.CPF,
                        IDCLIENTE = model.Id
                    });
                }
            }

            return Json("Cadastro alterado com sucesso");
        }


        [HttpGet]
        public ActionResult Alterar(long id)
        {
            BoCliente bo = new BoCliente();
            BoBeneficiario bob = new BoBeneficiario();

            Cliente cliente = bo.Consultar(id);
            Models.ClienteModel model = null;
            List<Beneficiario> listaBeneficiarios = bob.Listar(cliente.Id);
            List<BeneficiarioModel> listaModal = new List<BeneficiarioModel>();

            if (listaBeneficiarios != null)
            {
                foreach (var item in listaBeneficiarios)
                {
                    listaModal.Add(new BeneficiarioModel(item.Id, Convert.ToUInt64(item.CPF).ToString(@"000\.000\.000\-00"), item.Nome, item.IDCLIENTE));
                }
            }
            if (cliente != null)
            {
                model = new ClienteModel()
                {
                    Id = cliente.Id,
                    CEP = cliente.CEP,
                    Cidade = cliente.Cidade,
                    Email = cliente.Email,
                    Estado = cliente.Estado,
                    Logradouro = cliente.Logradouro,
                    Nacionalidade = cliente.Nacionalidade,
                    Nome = cliente.Nome,
                    Sobrenome = cliente.Sobrenome,
                    Telefone = cliente.Telefone,
                    CPF = Convert.ToUInt64(cliente.CPF).ToString(@"000\.000\.000\-00"),
                    BeneficiariosCliente = listaModal
                };

            
            }

            return View(model);
        }

        [HttpPost]
        public JsonResult ClienteList(int jtStartIndex = 0, int jtPageSize = 0, string jtSorting = null)
        {
            try
            {
                int qtd = 0;
                string campo = string.Empty;
                string crescente = string.Empty;
                string[] array = jtSorting.Split(' ');

                if (array.Length > 0)
                    campo = array[0];

                if (array.Length > 1)
                    crescente = array[1];

                List<Cliente> clientes = new BoCliente().Pesquisa(jtStartIndex, jtPageSize, campo, crescente.Equals("ASC", StringComparison.InvariantCultureIgnoreCase), out qtd);

                //Return result to jTable
                return Json(new { Result = "OK", Records = clientes, TotalRecordCount = qtd });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }
    }
}