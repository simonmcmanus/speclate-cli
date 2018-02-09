var dynamicRoutes = require('../../lib/generators/dynamic-routes')

describe('given a spec with dynamic routes ', function () {
  var spec = {
    '/:date/index.html': {
      page: 'link',
      data: [
        {
          created: '2007-12-12',
          title: 'item 1'
        },
        {
          created: '2007-10-10',
          title: 'item 2'
        }
      ],
      url: function (item) {
        return '/links/' + item.created.replace(/ /g, '-') + '/index.html'
      },
      spec: {
        title: 'page title',
        '.links_holder': {
          component: 'link'
        }
      }
    }
  }

  describe('calling dynmaic-routes', function () {
    var generatedRoutes = dynamicRoutes(spec)

    //console.log('-gu', generatedRoutes);
    it('should not change the title value', () => {
      expect(generatedRoutes['/links/2007-10-10/index.html'].spec.title).toEqual('item 2')
    })

    it('Should generate the dynamic route for 2007-10-10', () => {

      expect(generatedRoutes['/links/2007-10-10/index.html'].spec.title).toEqual('item 2')
      expect(generatedRoutes['/links/2007-12-12/index.html'].spec.title).toEqual('item 1')
      //expect(generatedRoutes['/links/2007-10-10/index.html'].spec['.links_holder'].data[0]['.created']).toEqual('2007-10-10')
    })

    // it('should not change the title value', () => {
    //   expect(generatedRoutes['/links/2007-12-12/index.html'].spec.title).toEqual('page title')
    // })

    // it('Should generate the dynamic route for 2007-12-12', () => {
    //   expect(generatedRoutes['/links/2007-12-12/index.html'].spec['.links_holder'].data.length).toEqual(1)
    //   expect(generatedRoutes['/links/2007-12-12/index.html'].spec['.links_holder'].data[0]['.created']).toEqual('2007-12-12')
    // })
    // it('should remove the orignal dynamic route', () => {
    //   expect(generatedRoutes['/:date/index.html']).toEqual(undefined)
    // })
  })
})
