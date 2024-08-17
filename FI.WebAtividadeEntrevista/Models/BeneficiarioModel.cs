using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebAtividadeEntrevista.Models
{
    /// <summary>
    /// Classe de Modelo de Beneficiario
    /// </summary>
    public class BeneficiarioModel
    {
        public BeneficiarioModel()
        {
            
        }
        public BeneficiarioModel(long id, string cPF, string nome, long iDCLIENT)
        {
            Id = id;
            CPF = cPF;
            Nome = nome;
            IDCLIENT = iDCLIENT;
        }

        public long Id { get; set; }
        
        public string CPF { get; set; }
 
        public string Nome { get; set; }

        public long IDCLIENT { get; set; }

    }
}