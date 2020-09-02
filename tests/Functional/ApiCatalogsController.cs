using Core.Dto;
using Microsoft.eShopWeb.FunctionalTests.Web;
using System.IO;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Xunit;

namespace Functional
{
    public class ApiCatalogsController : IClassFixture<WebTestFixture>
    {

        JsonSerializerOptions _jsonOptions = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

        public HttpClient Client { get; }

        public ApiCatalogsController(WebTestFixture factory)
        {
            Client = factory.CreateClient();
        }

        [Fact]
        public async Task GetCatalogByIdTest()
        {
            int catalogId = 1;
            var response = await Client.GetAsync($"/api/catalogs/{catalogId}");
            response.EnsureSuccessStatusCode();

            var stringResponse = await response.Content.ReadAsStringAsync();
            var catalogDto = JsonSerializer.Deserialize<CatalogDto>(stringResponse, _jsonOptions);

            Assert.NotNull(catalogDto);
        }

        [Fact]
        public async Task PutImageTest()
        {
            int catalogId = 1;
            var path = @$"..\..\..\Images\Aeroflot_Tu-154B-2_CCCP-85396_ZRH_1982-6-20.png";

            using var fs = new FileStream(path, FileMode.Open, FileAccess.Read);

            var content = new MultipartFormDataContent();
            var sc = new StreamContent(fs);
            sc.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("image/png");
            content.Add(sc);


            content.Add(new StreamContent(fs) { }, "image", "Aeroflot_Tu-154B-2_CCCP-85396_ZRH_1982-6-20.png");


            var ct = content.Headers.ContentType;

            var response = await Client.PutAsync($"/api/catalogs/{catalogId}/image", content);
            response.EnsureSuccessStatusCode();
        }
    }
}
