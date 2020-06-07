using Microsoft.AspNetCore.Razor.TagHelpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.HtmlHelper
{
    public class InputFieldTagHelper : BaseTagHelper
    {
        public string Type { get; set; }

        public override void Process(TagHelperContext context, TagHelperOutput output)
        {
            output.TagName = "input";

            if (string.IsNullOrEmpty(Type))
            {
                output.Attributes.SetAttribute("type", "text");
            }
            else
            {
                output.Attributes.SetAttribute("type", Type);
            }

            if (!string.IsNullOrEmpty(VModel))
            {
                output.Attributes.SetAttribute("v-model", VModel);
            }

            output.Attributes.SetAttribute("class", "form-control");

            output.PreElement.AppendHtml("<div class=\"form-group row\">");

            output.PreElement.AppendHtml(string.Format("<label class=\"col-sm-3 col-form-label\">{0}", Label));

            if (Rules.Contains("required"))
            {
                output.PreElement.AppendHtml(" <span class=\"required-field-label\">*</span>");
            }

            output.PreElement.AppendHtml("</label>");

            output.PreElement.AppendHtml("<div class=\"col-sm-9\">");

            if (!string.IsNullOrEmpty(Rules))
            {
                output.PreElement.AppendHtml(string.Format("<validation-provider v-slot=\"{{errors}}\" rules=\"{0}\" name=\"{1}\"", Rules, Name));
                if (!string.IsNullOrEmpty(Vid))
                {
                    output.PreElement.AppendHtml($" vid=\"{Vid}\"");
                }
                output.PreElement.AppendHtml(">");
                output.PostElement.AppendHtml("<span class=\"required-field-message\" v-text=\"errors[0]\"></span>");
                output.PostElement.AppendHtml("</validation-provider>");
            }

            output.PostElement.AppendHtml("</div>");
            output.PostElement.AppendHtml("</div>");
        }
    }
}
