using Microsoft.AspNetCore.Razor.TagHelpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.HtmlHelper
{
    public class BaseTagHelper : TagHelper
    {
        public virtual string VModel { get; set; }

        public virtual string Name { get; set; }

        public virtual string Label { get; set; }

        public virtual string Rules { get; set; } = string.Empty;
    }
}
