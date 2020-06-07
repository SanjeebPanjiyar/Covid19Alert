using Infrastructure.BaseViewModel;
using Service.Enum;
using System;
using System.Collections.Generic;
using System.Text;

namespace Service.BaseViewModel
{
    public class SignInResponseModel
    {
        public LoginEnum Login { get; set; }
        public BaseApplicationUserViewModel User { get; set; }
    }
}
